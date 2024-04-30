import { ObjectId, Schema, model } from "mongoose";

interface IArticle {
	_id: ObjectId;
	title: string;
	description: string;
	image: string;
	content: string;
	publishedAt: Date;
	updatedAt: Date;
}

const articleSchema = new Schema<IArticle>({
	title: { type: String, required: true, index: true, unique: true },
	description: { type: String, required: true },
	image: { type: String, required: true },
	content: { type: String, required: true },
	publishedAt: { type: Date, required: true, default: Date.now() },
	updatedAt: { type: Date, required: true, default: Date.now() },
});

const Article = model<IArticle>("Article", articleSchema);

export default Article;
