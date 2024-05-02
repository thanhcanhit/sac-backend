import { ObjectId, Schema, model } from "mongoose";

type UserRole = "admin" | "user";
type Gender = "male" | "female" | "other";

interface IAccount {
	_id: ObjectId;
	username: string;
	phone: string;	
	password: string;
	name: string;
	gender: Gender;
	role: UserRole;
}

const accountSchema = new Schema<IAccount>({
	username: { type: String, required: true, unique: true },
	phone: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	gender: { type: String, required: true, default: "other" },
	role: { type: String, required: true, default: "user" },
});

export default model<IAccount>("Account", accountSchema);
