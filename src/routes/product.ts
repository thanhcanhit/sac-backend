import express from "express";
import ProductController from "../controllers/ProductController";
import MiddlewareController from "../controllers/MiddlewareController";

const productRouter = express.Router();
const productController = new ProductController();
const middlewareController = new MiddlewareController();

productRouter.get("/size", productController.getProductSize);
productRouter.get("/:id", productController.getProductById);
productRouter.get("/", productController.getAllProducts);
productRouter.post(
	"/",
	middlewareController.verifyAdminToken,
	productController.createProduct
);
productRouter.patch(
	"/:id",
	middlewareController.verifyAdminToken,
	productController.updateProduct
);
productRouter.delete(
	"/:id",
	middlewareController.verifyAdminToken,
	productController.deleteProduct
);

export default productRouter;
