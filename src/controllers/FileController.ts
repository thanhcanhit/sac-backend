import { NextFunction, Request, Response } from "express";
import MulterFactory from "../configs/multerConfig";
import ImageStorage, { OwnerType } from "../models/ImageStorage";
import fs from "fs";
import Product from "../models/Product";
import Article from "../models/Article";
import { ObjectId, Types } from "mongoose";

export const ProductMulterInstance =
	MulterFactory.getInstance("/products").single("product");
export const ArticleMulterInstance =
	MulterFactory.getInstance("/articles").single("article");

const DEFAULT_OBJECT_ID = new Types.ObjectId("663229b8a9755ce6fea4812b");

/**
 * Mặc định khi upload file mà đối tượng sở hữu chưa được tạo sẽ được lưu tại default object gọi là temp,
 * sau khi đối tượng nào đó được gọi thì chuyển đổi toàn bộ temp thành file của đối tượng đó
 * -> gọi hàm clean để lọc những file không sử dụng
 */
class FileController {
	constructor() {
		this.uploadImage = this.uploadImage.bind(this);
		this.uploadToTemp = this.uploadToTemp.bind(this);
		this.changeOwnerOfTempFile = this.changeOwnerOfTempFile.bind(this);
		this.cleanUpImageStorage = this.cleanUpImageStorage.bind(this);
		this.deleteImageStorage = this.deleteImageStorage.bind(this);
	}

	async uploadImage(req: Request, res: Response, next: NextFunction) {
		const file = req.file;

		if (!file) {
			const error = new Error("Please upload a file");

			return next(error);
		}

		// File management logic
		const { owner_id, type } = req.params;

		// Check if owner_id is provided, if not delete the uploaded file
		if (!owner_id || !type) {
			fs.unlinkSync(file.path);
			res.status(400).json({ message: "owner_id is required" });
			return;
		}
		const imageStorage = await ImageStorage.findOne({
			ownerId: owner_id,
		});

		// If there is no image storage, create a new one
		if (!imageStorage) {
			const newImageStorage = new ImageStorage({
				ownerId: owner_id,
				ownerType: type,
				paths: [file.path],
			});

			await newImageStorage.save();
		} else {
			imageStorage.paths.push(file.path);
			await imageStorage.save();
		}

		res
			.status(201)
			.json({ message: "Image upload successfuly", path: file.path });
	}

	async uploadToTemp(req: Request, res: Response, next: NextFunction) {
		const file = req.file;

		if (!file) {
			const error = new Error("Please upload a file");

			return next(error);
		}

		const imageStorage = await ImageStorage.findOne({
			ownerId: DEFAULT_OBJECT_ID,
		});

		if (!imageStorage) {
			const newImageStorage = new ImageStorage({
				ownerId: DEFAULT_OBJECT_ID,
				ownerType: "article",
				paths: [file.path],
			});

			await newImageStorage.save();
		} else {
			imageStorage.paths.push(file.path);
			await imageStorage.save();
		}

		res
			.status(201)
			.json({ message: "Image upload successfuly", path: file.path });
	}

	async changeOwnerOfTempFile(
		newOwnerId: ObjectId,
		ownerType: OwnerType
	): Promise<boolean> {
		const imageStorage = await ImageStorage.findOne({
			ownerId: DEFAULT_OBJECT_ID,
		});

		if (!imageStorage) {
			return false;
		} else {
			imageStorage.ownerId = newOwnerId;
			imageStorage.ownerType = ownerType;
			await imageStorage.save();
			this.cleanUpImageStorage(newOwnerId, ownerType);
			return true;
		}
	}

	async cleanUpImageStorage(ownerId: ObjectId | string, ownerType: OwnerType) {
		const imageStorage = await ImageStorage.findOne({
			ownerId,
			ownerType,
		});

		if (!imageStorage) return;

		if (ownerType === "product") {
			const ownerObject = await Product.findById(ownerId);

			imageStorage.paths = imageStorage.paths.filter((storagePath) => {
				const isUsed = ownerObject?.images.some((image) =>
					image.includes(storagePath)
				);

				if (!isUsed) {
					fs.unlinkSync(storagePath);
				}

				return isUsed;
			});
		} else {
			const ownerObject = await Article.findById(ownerId);

			imageStorage.paths = imageStorage.paths.filter((storagePath) => {
				const isUse = ownerObject?.content.includes(storagePath);

				if (!isUse) {
					fs.unlinkSync(storagePath);
				}

				return isUse;
			});
		}

		imageStorage.save();
	}

	async deleteImageStorage(ownerId: string) {
		const imageStorage = await ImageStorage.findOne({
			ownerId,
		});

		if (!imageStorage) return;

		imageStorage.paths.forEach((storagePath) => {
			fs.unlinkSync(storagePath);
		});

		await imageStorage.deleteOne();
	}
}

export default FileController;
