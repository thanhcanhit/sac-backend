import { ObjectId, Schema, Types, model } from "mongoose";

interface IImageStorage {
	_id: ObjectId;
	ownerType: "article" | "product";
	ownerId: ObjectId;
	paths: string[];
}

const imageStorageSchema = new Schema<IImageStorage>({
	ownerType: { type: String, required: true },
	ownerId: { type: Types.ObjectId, required: true },
	paths: { type: [String], required: true },
});

imageStorageSchema.index({ ownerId: 1 }, { unique: true });

const ImageStorage = model<IImageStorage>("ImageStorage", imageStorageSchema);

export default ImageStorage;
