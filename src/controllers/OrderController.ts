import { Request, Response } from "express";
import Order from "../models/Order";

class OrderController {
	// GET /orders?limit=10&page=1
	public async getAllOrders(req: Request, res: Response): Promise<void> {
		try {
			const { limit, page } = req.query;
			let orders;
			if (limit && page) {
				orders = await Order.find()
					.limit(Number(limit))
					.skip((Number(page) - 1) * Number(limit));
			} else {
				orders = await Order.find();
			}

			const list = orders.map((order) => order.toObject());
			res.status(200).json({ message: "Get all orders", allOrders: list });
		} catch (err) {
			res.status(500).json({ message: "Error getting orders", error: err });
		}
	}

	// GET /orders/:id
	public async getOrderById(req: Request, res: Response): Promise<void> {
		try {
			const orderId = req.params.id;
			const order = await Order.findById(orderId);
			if (!order) {
				res.status(404).json({ message: "Order not found" });
			}
			res.status(200).json({
				message: `Get order with ID ${orderId}`,
				order,
			});
		} catch (err) {
			res.status(500).json({ message: "Error getting order", error: err });
		}
	}

	// POST /orders
	public async createOrder(req: Request, res: Response): Promise<boolean> {
		try {
			const { customer, orderDetails } = req.body;
			const newOrder = new Order({ customer, orderDetails });
			await newOrder.save();

			const order = await Order.findById(newOrder._id);
			res.status(201).json({ message: "Create order", order });
			return true;
		} catch (err) {
			res.status(500).json({ message: "Error creating order", error: err });
			return true;
		}
	}

	// PATCH /orders/:id
	public async updateOrder(req: Request, res: Response): Promise<boolean> {
		try {
			const orderId = req.params.id;
			const { customer, products } = req.body;
			await Order.findOneAndUpdate(
				{ _id: orderId },
				{ customer, products, updatedAt: Date.now() }
			);

			res.status(200).json({ message: `Update order with ID ${orderId}` });
			return true;
		} catch (err) {
			res.status(500).json({ message: "Error updating order", error: err });
			throw err;
		}
	}

	// DELETE /orders/:id
	public async deleteOrder(req: Request, res: Response): Promise<void> {
		try {
			const orderId = req.params.id;

			await Order.findOneAndDelete({ _id: orderId });

			res.status(200).json({ message: `Delete order with ID ${orderId}` });
		} catch (err) {
			res.status(500).json({ message: "Error deleting order", error: err });
		}
	}
}

export default OrderController;
