import { ObjectId, Schema, Types, model } from "mongoose";

interface IOrderDetail {
	productId: ObjectId;
	quantity: number;
	price: number;
	discount: number;
}

interface ICustomer {
	name: string;
	phone: string;
	address: string;
}

interface IOrder {
	_id: ObjectId;
	orderDate: Date;
	customerId: ObjectId;
	customer: ICustomer;
	orderDetails: IOrderDetail[];
}

const orderSchema = new Schema<IOrder>({
	orderDate: { type: Date, required: true, default: Date.now() },
	customerId: {type: Types.ObjectId, required: true, ref: "Customer"},
	customer: {
		name: { type: String, required: true },
		phone: { type: String, required: true },
		address: { type: String, required: true },
	},
	orderDetails: [
		{
			productId: { type: Types.ObjectId, required: true, ref: "Product" },
			quantity: { type: Number, required: true },
			price: { type: Number, required: true },
			discount: { type: Number, required: true, default: 0 },
		},
	],
});

export default model<IOrder>("Order", orderSchema);
