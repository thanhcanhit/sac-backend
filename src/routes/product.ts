import express from "express";
import ProductController from "../controllers/ProductController";
import MiddlewareController from "../controllers/MiddlewareController";

const productRouter = express.Router();
const productController = new ProductController();
const middlewareController = new MiddlewareController();

productRouter.get("/size", productController.getProductSize);

productRouter.get("/deleted/size", productController.getDeletedProductSize);

productRouter.get(
  "/deleted",
  middlewareController.verifyAdminToken,
  productController.getDeletedProducts,
);

productRouter.get("/:id", productController.getProductById);

productRouter.get("/", productController.getAllProducts);

productRouter.post(
  "/",
  middlewareController.verifyAdminToken,
  productController.createProduct,
);

productRouter.patch(
  "/:id/soft-delete",
  middlewareController.verifyAdminToken,
  productController.softDeleteProduct,
);

productRouter.patch(
  "/:id/restore",
  middlewareController.verifyAdminToken,
  productController.restoreProduct,
);

productRouter.patch(
  "/:id",
  middlewareController.verifyAdminToken,
  productController.updateProduct,
);
productRouter.delete(
  "/:id",
  middlewareController.verifyAdminToken,
  productController.deleteProduct,
);

export default productRouter;
