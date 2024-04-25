import { ObjectId, Schema, Types, model } from "mongoose";

export interface IToken {
	value: string;
	user_id: ObjectId;
	isUsed: boolean;
}

const tokenSchema = new Schema<IToken>(
	{
		value: { type: String, required: true },
		user_id: { type: Types.ObjectId, required: true, ref: "Account" },
		isUsed: { type: Boolean, required: true, default: false },
	},
	{ timestamps: true }
);

export default model<IToken>("Token", tokenSchema);
