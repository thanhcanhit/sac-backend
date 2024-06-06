import { ObjectId, Schema, Types, model } from "mongoose";

export type OwnerType = "article" | "product";

interface IImageStorage {
  _id: ObjectId;
  // publisherId: ObjectId;
  ownerType: OwnerType;
  ownerId: ObjectId;
  paths: string[];
}

const imageStorageSchema = new Schema<IImageStorage>({
  // publisherId: { type: Types.ObjectId, required: true },
  ownerType: { type: String, required: true, default: "article" },
  ownerId: { type: Types.ObjectId, required: true },
  paths: { type: [String], required: true },
});

imageStorageSchema.index({ ownerId: 1 }, { unique: true });

const ImageStorage = model<IImageStorage>("ImageStorage", imageStorageSchema);

export default ImageStorage;
