import { ObjectId, Schema, model } from "mongoose";

type UserRole = "admin" | "user";
type Gender = "male" | "female" | "other";

interface IAccount {
  _id: ObjectId;
  phone: string;
  password: string;
  name: string;
  email?: string;
  gender: Gender;
  role: UserRole;
  avatar?: string;
  address?: string[];
}

const accountSchema = new Schema<IAccount>({
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, unique: true },
  name: { type: String, required: true },
  gender: { type: String, required: true, default: "other" },
  role: { type: String, required: true, default: "user" },
  avatar: { type: String },
  address: { type: [String], default: [], unique: true },
});

// craete index for phone
accountSchema.index({ phone: 1 });
// create index for email
accountSchema.index({ email: 1 });
export default model<IAccount>("Account", accountSchema);
