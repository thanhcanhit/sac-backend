import express from "express";
import OrderController from "../controllers/OrderController";
import MiddlewareController from "../controllers/MiddlewareController";

const orderRouter = express.Router();
const orderController = new OrderController();
const middlewareController = new MiddlewareController();

orderRouter.get("/:id", orderController.getOrderById);
orderRouter.get("/", orderController.getAllOrders);
orderRouter.post(
	"/",
	middlewareController.verifyToken,
	orderController.createOrder
);
orderRouter.patch(
	"/:id",
	middlewareController.verifyToken,
	orderController.updateOrder
);
orderRouter.delete(
	"/:id",
	middlewareController.verifyAdminToken,
	orderController.deleteOrder
);

export default orderRouter;
