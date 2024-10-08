import { ObjectId, Schema, model } from "mongoose";

interface IArticle {
  _id: ObjectId;
  title: string;
  description: string;
  image: string;
  content: string;
  view: number;
  publishedAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: Date;
}

const articleSchema = new Schema<IArticle>({
  title: { type: String, required: true, index: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  view: { type: Number, required: true, default: 0 },
  content: { type: String, required: true },
  publishedAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  isDeleted: { type: Boolean, required: true, default: false },
  deletedAt: { type: Date, required: false, default: null },
});

const Article = model<IArticle>("Article", articleSchema);

export default Article;
