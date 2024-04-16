import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import ConnectDB from "./utils/ConnectDB";
import router from "./routes";

// Configurations
dotenv.config();

// Constants
const PORT = process.env.PORT || 3000;
const app = express();

// Provides static files
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
ConnectDB.connectDB();

// Routes
router(app);

// Handle Miđleware
app.use((req: Request, res: Response) => {
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
