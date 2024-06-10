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
        products = await Product.find({ isDeleted: false })
          .sort({ createdAt: -1 })
          .limit(Number(limit))
          .skip((Number(page) - 1) * Number(limit));
      } else {
        products = await Product.find({ isDeleted: false }).sort({
          createdAt: -1,
        });
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
      const product = await Product.findOne({ _id: productId, isDeleted: false });
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
      const { name, images, price, discount, description, inventory } =
        req.body;
      const newProduct = new Product({
        name,
        images,
        price,
        discount,
        description,
        inventory,
      });
      await newProduct.save();
      const product = await Product.findById(newProduct._id);
      if (!product) {
        res.status(404).json({ message: "Not found product after created" });
        return false;
      }
      fileController.changeOwnerOfTempFile(product._id, "product");
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
        { name, images, price, discount, description, updatedAt: Date.now() },
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
      const size = await Product.countDocuments({ isDeleted: false });
      res.status(200).json({ message: "Get product size", size });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error getting product size", error: err });
    }
  }

  // GET /products/deleted
  public async getDeletedProducts(req: Request, res: Response): Promise<void> {
    try {
      const { limit, page } = req.query;
      let products;

      if (limit && page) {
        products = await Product.find({ isDeleted: true })
          .sort({ deletedAt: -1 })
          .limit(Number(limit))
          .skip((Number(page) - 1) * Number(limit));
      } else {
        products = await Product.find({ isDeleted: true }).sort({
          deletedAt: -1,
        });
      }

      const list = products.map((product) => product.toObject());
      res
        .status(200)
        .json({ message: "Get all deleted products", deletedProducts: list });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error getting deleted products", error: err });
    }
  }

  // PATCH /products/:id/soft-delete
  public async softDeleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      await Product.findOneAndUpdate(
        { _id: productId },
        { isDeleted: true, deletedAt: new Date() },
      );
      res
        .status(200)
        .json({ message: `Soft delete product with ID ${productId}` });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error soft deleting product", error: err });
    }
  }

  // PATCH /products/:id/restore
  public async restoreProduct(req: Request, res: Response): Promise<void> {
    try {
      const productId = req.params.id;
      await Product.findOneAndUpdate(
        { _id: productId },
        { isDeleted: false, deletedAt: null },
      );
      res.status(200).json({ message: `Restore product with ID ${productId}` });
    } catch (err) {
      res.status(500).json({ message: "Error restoring product", error: err });
    }
  }

  // GET /products/deleted/size
  public async getDeletedProductSize(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const size = await Product.countDocuments({ isDeleted: true });
      res.status(200).json({ message: "Get deleted product size", size });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error deleted getting product size", error: err });
    }
  }
}

export default ProductController;
