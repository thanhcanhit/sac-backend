import { ObjectId, Schema, Types, model } from "mongoose";

type UserRole = "admin" | "user";

interface IAccount {
	_id: ObjectId;
	username: string;
	phone: string;
	password: string;
	role: UserRole;
}

const accountSchema = new Schema<IAccount>({
	username: { type: String, required: true, index: true },
	phone: { type: String, required: true },
	password: { type: String, required: true },
	role: { type: String, required: true, default: "user" },
});

export default model<IAccount>("Account", accountSchema);
