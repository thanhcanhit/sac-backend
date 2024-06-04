import { ObjectId, Schema, Types, model } from "mongoose";

interface IFeedback {
  _id: ObjectId;
  nameUser: string;
  rate: number;
  content: string;
  createdAt: Date;
  user_id: ObjectId;
  product_id: ObjectId;
}

const feedbackSchema = new Schema<IFeedback>({
  rate: { type: Number, required: true },
  nameUser: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  user_id: { type: Types.ObjectId, required: true, ref: "Account" },
  product_id: { type: Types.ObjectId, required: true, ref: "Product" },
});

export default model<IFeedback>("Feedback", feedbackSchema);
