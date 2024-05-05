import { Request, Response } from "express";
import Feedback from "../models/Feedback";
import Product from "../models/Product";

class FeedbackController {
	// GET /feedbacks?limit=10&page=1
	public async getAllFeedbacks(req: Request, res: Response): Promise<void> {
		try {
			const { limit, page } = req.query;
			let feedbacks;
			if (limit && page) {
				feedbacks = await Feedback.find()
					.limit(Number(limit))
					.skip((Number(page) - 1) * Number(limit));
			} else {
				feedbacks = await Feedback.find();
			}

			const list = feedbacks.map((feedback) => feedback.toObject());
			res.status(200).json({ message: "Get all feedbacks", allFeedback: list });
		} catch (err) {
			res.status(500).json({ message: "Error getting feedbacks", error: err });
		}
	}

	// GET /feedbacks/:id
	public async getFeedbackById(req: Request, res: Response): Promise<void> {
		try {
			const feedbackId = req.params.id;
			const feedback = await Feedback.findById(feedbackId);
			if (!feedback) {
				res.status(404).json({ message: "Feedback not found" });
				return;
			}

			res.status(200).json({
				message: `Get feedback with ID ${feedbackId}`,
				feedback,
			});
			return;
		} catch (err) {
			res.status(500).json({ message: "Error getting feedback", error: err });
		}
	}
	// GET /feedbacks/products/:product_id?limit=10&page=1
	public async getFeedbackByProduct(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const productId = req.params.product_id;
			const { limit, page } = req.query;
			let feedbacks;
			if (limit && page) {
				feedbacks = await Feedback.find({ product_id: productId })
					.sort({ createdAt: -1 })
					.limit(Number(limit))
					.skip((Number(page) - 1) * Number(limit));
			} else {
				feedbacks = await Feedback.find({ product_id: productId }).sort({
					createdAt: -1,
				});
			}

			res.status(200).json({
				message: `Get feedback with productID ${productId}`,
				feedbacks,
			});
		} catch (err) {
			res.status(500).json({ message: "Error getting feedback", error: err });
		}
	}

	// GET /feedbacks/products/:product_id/size
	public async getFeedbackSizeByProduct(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const productId = req.params.product_id;

			//count document feedbacks
			const size = await Feedback.countDocuments({ product_id: productId });

			res.status(200).json({
				message: `Get feedback size with productID ${productId}`,
				size,
			});
		} catch (err) {
			res.status(500).json({ message: "Error getting feedback size", error: err });
		}
	}

	// POST /feedbacks
	public async createFeedback(req: Request, res: Response): Promise<boolean> {
		try {
			const { rate, content, user_id, product_id, nameUser } = req.body;

			const product = await Product.findById(product_id);
			if (!product) {
				res.status(404).json({ message: "Product not found" });
				return false;
			}

			// Update product rate
			const totalRate = product.rate * product.quantityRate + rate;
			const newQuantityRate = product.quantityRate + 1;
			const newRate = totalRate / newQuantityRate;
			await Product.findOneAndUpdate(
				{ _id: product_id },
				{ rate: newRate, quantityRate: newQuantityRate }
			);

			// Create feedback
			const newFeedback = new Feedback({
				rate,
				content,
				user_id,
				product_id,
				nameUser,
			});
			await newFeedback.save();
			const feedback = await Feedback.findById(newFeedback);

			res.status(201).json({ message: "Create feedback", feedback });
			return true;
		} catch (err) {
			res.status(500).json({ message: "Error creating feedback", error: err });
			return true;
		}
	}

	// PATCH /feedbacks/:id
	public async updateFeedback(req: Request, res: Response): Promise<boolean> {
		try {
			const feedbackId = req.params.id;
			const { rate, content, user_id, product_id } = req.body;

			// Check product exist
			const product = await Product.findById(product_id);
			if (!product) {
				res.status(404).json({ message: "Product not found" });
				return false;
			}

			// Check feedback exist
			const feedback = await Feedback.findById(feedbackId);
			if (!feedback) {
				res.status(404).json({ message: "Feedback not found" });
				return false;
			}

			// Update product rate
			const oldRate = feedback.rate;
			const totalRate = product.rate * product.quantityRate - oldRate + rate;
			const newRate = totalRate / product.quantityRate;
			await Product.findOneAndUpdate({ _id: product_id }, { rate: newRate });

			// Update feedback
			await Feedback.findOneAndUpdate(
				{ _id: feedbackId },
				{ rate, content, user_id, product_id }
			);

			res
				.status(200)
				.json({ message: `Update feedback with ID ${feedbackId}` });
			return true;
		} catch (err) {
			res.status(500).json({ message: "Error updating feedback", error: err });
			throw err;
		}
	}

	// DELETE /feedbacks/:id
	public async deleteFeedback(req: Request, res: Response): Promise<void> {
		try {
			const feedbackId = req.params.id;

			const feedback = await Feedback.findById(feedbackId);
			if (!feedback) {
				res.status(404).json({ message: "Feedback not found" });
				return;
			}
			const product = await Product.findById(feedback.product_id);
			if (!product) {
				res.status(404).json({ message: "Product not found" });
				return;
			}

			// Update product rate when deleted feedback
			const totalRate = product.rate * product.quantityRate - feedback.rate;
			const newQuantityRate = product.quantityRate - 1;
			const newRate = newQuantityRate === 0 ? 0 : totalRate / newQuantityRate;
			await Product.findOneAndUpdate(
				{ _id: feedback.product_id },
				{ rate: newRate, quantityRate: newQuantityRate }
			);

			await Feedback.findOneAndDelete({ _id: feedbackId });

			res
				.status(200)
				.json({ message: `Delete feedback with ID ${feedbackId}` });
		} catch (err) {
			res.status(500).json({ message: "Error deleting feedback", error: err });
		}
	}
}

export default FeedbackController;
