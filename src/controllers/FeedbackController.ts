import { Request, Response } from "express";
import Feedback from "../models/Feedback";

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
			}
			res.status(200).json({
				message: `Get feedback with ID ${feedbackId}`,
				feedback,
			});
		} catch (err) {
			res.status(500).json({ message: "Error getting feedback", error: err });
		}
	}
	// GET /feedbacks/products/:product_id
	public async getFeedbackByProduct(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			const productId = req.params.product_id;
			const feedbacks = await Feedback.find({ product_id: productId });
			if (!feedbacks) {
				res.status(404).json({ message: "Feedback not found" });
			}
			res.status(200).json({
				message: `Get feedback with productID ${productId}`,
				feedbacks,
			});
		} catch (err) {
			res.status(500).json({ message: "Error getting feedback", error: err });
		}
	}

	// POST /feedbacks
	public async createFeedback(req: Request, res: Response): Promise<boolean> {
		try {
			const { rate, content, user_id, product_id } = req.body;
			const newFeedback = new Feedback({ rate, content, user_id, product_id });
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
			await Feedback.findOneAndUpdate(
				{ _id: feedbackId },
				{ rate, content, user_id, product_id, updatedAt: Date.now() }
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
