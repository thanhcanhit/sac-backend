import express from "express";
import FileController, {
	ArticleMulterInstance,
	ProductMulterInstance,
} from "../controllers/FileController";
import MiddlewareController from "../controllers/MiddlewareController";

const fileRouter = express.Router();
const fileController = new FileController();
const middlewareController = new MiddlewareController();

fileRouter.post("/article", ArticleMulterInstance, fileController.uploadImage);

fileRouter.post("/product", ProductMulterInstance, fileController.uploadImage);

export default fileRouter;
