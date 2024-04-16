import { Express } from "express";
import articleRoute from "./article";
import productRouter from "./product";
import orderRouter from "./order";

function router(app: Express) {
	app.use("/articles", articleRoute);
	app.use("/products", productRouter);
	app.use("/orders", orderRouter);
}

export default router;
