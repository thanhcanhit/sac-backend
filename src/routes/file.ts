import express from "express";
import FileController, {
  ArticleMulterInstance,
  ProductMulterInstance,
} from "../controllers/FileController";
import MiddlewareController from "../controllers/MiddlewareController";

const fileRouter = express.Router();
const fileController = new FileController();
const middlewareController = new MiddlewareController();

fileRouter.post(
  "/article/",
  middlewareController.verifyAdminToken,
  ArticleMulterInstance,
  fileController.uploadToTemp,
);

fileRouter.patch(
  "/article/",
  middlewareController.verifyAdminToken,
  ArticleMulterInstance,
  fileController.uploadImage,
);

fileRouter.post(
  "/product/",
  middlewareController.verifyAdminToken,
  ProductMulterInstance,
  fileController.uploadToTemp,
);
fileRouter.patch(
  "/product/",
  middlewareController.verifyAdminToken,
  ProductMulterInstance,
  fileController.uploadImage,
);

export default fileRouter;
