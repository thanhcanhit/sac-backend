import { Request, Response } from "express";
import Product from "../models/Product";
import FileController from "./FileController";

const fileController = new FileController();

class ProductController {
	// GET /products?limit=10&page=1
	public async getAllProducts(req: Request, res: Response): Promise<void> {
		try {
			const { limit, page } = req.query;
			let products;

			if (limit && page) {
				products = await Product.find()
					.limit(Number(limit))
					.skip((Number(page) - 1) * Number(limit));
			} else {
				products = await Product.find();
			}

			const list = products.map((product) => product.toObject());
			res.status(200).json({ message: "Get all products", allProducts: list });
		} catch (err) {
			res.status(500).json({ message: "Error getting products", error: err });
		}
	}

	// GET /products/:id
	public async getProductById(req: Request, res: Response): Promise<void> {
		try {
			const productId = req.params.id;
			const product = await Product.findById(productId);
			if (!product) {
				res.status(404).json({ message: "Product not found" });
			}
			res.status(200).json({
				message: `Get product with ID ${productId}`,
				product,
			});
		} catch (err) {
			res.status(500).json({ message: "Error getting product", error: err });
		}
	}

	// POST /products
	public async createProduct(req: Request, res: Response): Promise<boolean> {
		try {
			const { name, images, price, discount, description } = req.body;
			const newProduct = new Product({
				name,
				images,
				price,
				discount,
				description,
			});
			await newProduct.save();
			const product = await Product.findById(newProduct._id);
			fileController.cleanUpImageStorage(String(product?._id), "product");
			res.status(201).json({ message: "Create product", product });
			return true;
		} catch (err) {
			res.status(500).json({ message: "Error creating product", error: err });
			return true;
		}
	}

	// PATCH /products/:id
	public async updateProduct(req: Request, res: Response): Promise<boolean> {
		try {
			const productId = req.params.id;
			const { name, images, price, discount, description } = req.body;
			await Product.findOneAndUpdate(
				{ _id: productId },
				{ name, images, price, discount, description, updatedAt: Date.now() }
			);

			fileController.cleanUpImageStorage(String(productId), "product");
			res.status(200).json({ message: `Update product with ID ${productId}` });
			return true;
		} catch (err) {
			res.status(500).json({ message: "Error updating product", error: err });
			throw err;
		}
	}

	// DELETE /products/:id
	public async deleteProduct(req: Request, res: Response): Promise<void> {
		try {
			const productId = req.params.id;

			await Product.findOneAndDelete({ _id: productId });
			fileController.deleteImageStorage(String(productId));

			res.status(200).json({ message: `Delete product with ID ${productId}` });
		} catch (err) {
			res.status(500).json({ message: "Error deleting product", error: err });
		}
	}

	// GET /products/size
	public async getProductSize(req: Request, res: Response): Promise<void> {
		try {
			const size = await Product.countDocuments();
			res.status(200).json({ message: "Get product size", size });
		} catch (err) {
			res
				.status(500)
				.json({ message: "Error getting product size", error: err });
		}
	}
}

export default ProductController;
