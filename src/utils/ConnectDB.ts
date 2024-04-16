import mongoose from "mongoose";

class ConnectDB {
	private static connectString: string =
		process.env.DB_URL || "mongodb://localhost:27017/sac";

	public static async connectDB() {
		console.log("Connecting to ", this.connectString);
		await mongoose
			.connect("mongodb://localhost:27017/sac")
			.then(() => {
				console.log("Connected to database");
			})
			.catch((err) => {
				console.log("Error connecting to database", err);
			});
	}
}

export default ConnectDB;
