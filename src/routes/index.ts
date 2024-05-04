import { Express } from "express";
import articleRoute from "./article";
import productRouter from "./product";
import orderRouter from "./order";
import authRouter from "./auth";
import feedbackRouter from "./feedback";
import fileRouter from "./file";
import publicRouter from "./public";

function router(app: Express) {
	app.use("/articles", articleRoute);
	app.use("/products", productRouter);
	app.use("/orders", orderRouter);
	app.use("/feedbacks", feedbackRouter);
	app.use("/auth", authRouter);
	app.use("/files", fileRouter);
	app.use("/public", publicRouter);
}

export default router;
