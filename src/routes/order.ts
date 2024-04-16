import express from "express";
import OrderController from "../controllers/OrderController";

const orderRouter = express.Router();
const orderController = new OrderController();

orderRouter.get("/:id", orderController.getOrderById);
orderRouter.get("/", orderController.getAllOrders);
orderRouter.post("/", orderController.createOrder);
orderRouter.patch("/:id", orderController.updateOrder);
orderRouter.delete("/:id", orderController.deleteOrder);

export default orderRouter;
