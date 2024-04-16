import { Request, Response } from "express";
import Article from "../models/Article";

class ArticleController {
	// GET /articles?limit=10&page=1
	public async getAllArticles(req: Request, res: Response): Promise<void> {
		try {
			const { limit, page } = req.query;
			let articles;
			if (limit && page) {
				articles = await Article.find()
					.limit(Number(limit))
					.skip((Number(page) - 1) * Number(limit));
			} else {
				articles = await Article.find();
			}
			
			const list = articles.map((article) => article.toObject());
			res.status(200).json({ message: "Get all articles", allArticle: list });
		} catch (err) {
			res.status(500).json({ message: "Error getting articles", error: err });
		}
	}

	// GET /articles/:id
	public async getArticleById(req: Request, res: Response): Promise<void> {
		try {
			const articleId = req.params.id;
			const article = await Article.findById(articleId);
			if (!article) {
				res.status(404).json({ message: "Product not found" });
			}
			res.status(200).json({
				message: `Get article with ID ${articleId}`,
				article,
			});
		} catch (err) {
			res.status(500).json({ message: "Error getting article", error: err });
		}
	}

	// POST /articles
	public async createArticle(req: Request, res: Response): Promise<boolean> {
		try {
			const { title, description, image, content } = req.body;
			const newArticle = new Article({ title, description, image, content });
			await newArticle.save();
			const article = await Article.findById(newArticle);
			res.status(201).json({ message: "Create article", article });
			return true;
		} catch (err) {
			res.status(500).json({ message: "Error creating article", error: err });
			return true;
		}
	}

	// PATCH /articles/:id
	public async updateArticle(req: Request, res: Response): Promise<boolean> {
		try {
			const articleId = req.params.id;
			const { title, description, image, content } = req.body;
			await Article.findOneAndUpdate(
				{ _id: articleId },
				{ title, description, image, content, updatedAt: Date.now() }
			);

			res.status(200).json({ message: `Update article with ID ${articleId}` });
			return true;
		} catch (err) {
			res.status(500).json({ message: "Error updating article", error: err });
			throw err;
		}
	}

	// DELETE /articles/:id
	public async deleteArticle(req: Request, res: Response): Promise<void> {
		try {
			const articleId = req.params.id;

			await Article.findOneAndDelete({ _id: articleId });

			res.status(200).json({ message: `Delete article with ID ${articleId}` });
		} catch (err) {
			res.status(500).json({ message: "Error deleting article", error: err });
		}
	}
}

export default ArticleController;
