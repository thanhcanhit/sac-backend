import express from "express";
import FeedbackController from "../controllers/FeedbackController";
import MiddlewareController from "../controllers/MiddlewareController";

const feedbackRouter = express.Router();
const feedbackController = new FeedbackController();
const middlewareController = new MiddlewareController();

feedbackRouter.get("/products/:product_id/size", feedbackController.getFeedbackSizeByProduct);
feedbackRouter.get("/products/:product_id", feedbackController.getFeedbackByProduct);
feedbackRouter.get("/:id", feedbackController.getFeedbackById);
feedbackRouter.get("/", feedbackController.getAllFeedbacks);
feedbackRouter.post(
	"/",
	middlewareController.verifyToken,
	feedbackController.createFeedback
);
feedbackRouter.patch(
	"/:id",
	middlewareController.verifyToken,
	feedbackController.updateFeedback
);
feedbackRouter.delete(
	"/:id",
	middlewareController.verifyToken,
	feedbackController.deleteFeedback
);

export default feedbackRouter;
