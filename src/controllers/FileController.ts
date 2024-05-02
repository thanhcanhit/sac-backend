import { NextFunction, Request, Response } from "express";
import MulterFactory from "../configs/multerConfig";
import ImageStorage from "../models/ImageStorage";
import fs from "fs";
import Product from "../models/Product";
import Article from "../models/Article";

export const ProductMulterInstance =
	MulterFactory.getInstance("/products").single("product");
export const ArticleMulterInstance =
	MulterFactory.getInstance("/articles").single("article");

class FileController {
	async uploadImage(req: Request, res: Response, next: NextFunction) {
		const file = req.file;

		if (!file) {
			const error = new Error("Please upload a file");

			return next(error);
		}

		// File management logic
		const { owner_id, type } = req.body;

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

		res.json({ message: "Image upload successfuly", path: file.path });
	}

	async cleanUpImageStorage(ownerId: string, ownerType: "article" | "product") {
		const imageStorage = await ImageStorage.findOne({
			ownerId,
			ownerType,
		});

		if (!imageStorage) return;

		if (ownerType === "product") {
			const ownerObject = await Product.findById(ownerId);

			imageStorage.paths = imageStorage.paths.filter((storagePath) => {
				const isUsed =
					ownerObject?.images.findIndex((useimg) => useimg === storagePath) !==
					-1;

				if (isUsed) {
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
