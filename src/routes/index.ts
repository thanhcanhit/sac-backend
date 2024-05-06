import { Express } from "express";
import articleRoute from "./article";
import productRouter from "./product";
import orderRouter from "./order";
import authRouter from "./auth";
import feedbackRouter from "./feedback";
import fileRouter from "./file";
import publicRouter from "./public";

function router(app: Express) {
	const apiPrefix = "/api";

	app.use(`${apiPrefix}/articles`, articleRoute);
	app.use(`${apiPrefix}/products`, productRouter);
	app.use(`${apiPrefix}/orders`, orderRouter);
	app.use(`${apiPrefix}/feedbacks`, feedbackRouter);
	app.use(`${apiPrefix}/auth`, authRouter);
	app.use(`${apiPrefix}/files`, fileRouter);
	app.use(`${apiPrefix}/public`, publicRouter);

	app.get("/api", (req, res) => {
		res.send("Hello World!");
	});
}

export default router;
