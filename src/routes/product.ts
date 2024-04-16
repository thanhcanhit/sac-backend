import express from "express";
import ProductController from "../controllers/ProductController";

const productRouter = express.Router();
const productController = new ProductController();

productRouter.get("/:id", productController.getProductById);
productRouter.get("/", productController.getAllProducts);
productRouter.post("/", productController.createProduct);
productRouter.patch("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);

export default productRouter;
