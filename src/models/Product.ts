import { ObjectId, Schema, Types, model } from "mongoose";

interface IProduct {
	_id: ObjectId;
	name: string;
	images: string[];
	price: number;
	discount: {
		type: "percent" | "fixed";
		value: number;
	};
	description: string;
	inventory: number;
}

const productSchema = new Schema<IProduct>({
	name: { type: String, required: true, index: true, unique: true },
	images: { type: [String], required: true },
	price: { type: Number, required: true },
	discount: {
		type: { type: String, required: true, default: "percent" },
		value: { type: Number, required: true, default: 0 },
	},
	description: { type: String, required: true },
	inventory: { type: Number, required: true, default: 0 },
});

export default model<IProduct>("Product", productSchema);
