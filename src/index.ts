import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import ConnectDB from "./utils/ConnectDB";
import router from "./routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import MulterFactory from "./configs/multerConfig";
import path from "path";

// Configurations
if (process.env.NODE_ENV !== "production") {
	dotenv.config();
} else {
	dotenv.config({ path: ".env.production" });
}

// Constants
const PORT = process.env.PORT || 3000;
const app = express();

// Support cors
app.use(
	cors({
		origin: ["http://localhost:5173", "http://localhost:3000"],
		credentials: true,
	})
);

// Use middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to database
ConnectDB.connectDB();

// Provides static files
app.use("/public", express.static(path.join(__dirname, "../public")));
// Routes
router(app);

// Handle Miđleware
app.use((req: Request, res: Response) => {
	// check url has /public
	if (req.url.includes("/public")) {
		const filePath = req.url;
		res.status(200).sendFile(path.join(__dirname, "../", filePath));
		return;
	}
	res.status(404).json({ message: "Not found endpoint" });
});

// Error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({ message: "Internal Server Error" });
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
