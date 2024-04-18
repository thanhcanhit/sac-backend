import { NextFunction, Request, Response } from "express";
import Account from "../models/Account";
import HashString from "../utils/HashString";
import JsonWebToken from "../utils/JsonWebToken";
import { JwtPayload } from "jsonwebtoken";

class AccountController {
	// POST /auth/register
	public async register(req: Request, res: Response) {
		const { username, phone, password } = req.body;

		if (!username || !phone || !password) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const hashedPassword = await HashString.hash(password);
		try {
			const user = new Account({ username, phone, password: hashedPassword });
			await user.save();
			const { password, ...userWithoutPassword } = user.toObject();
			res.status(201).json({
				message: "Account created successfully",
				user: userWithoutPassword,
			});
		} catch (err) {
			res.status(500).json(err);
		}
	}

	// POST /auth/login
	public async login(req: Request, res: Response, next: NextFunction) {
		const { username, password } = req.body;
		if (!username || !password) {
			return res.status(400).json({ message: "Missing required fields" });
		}
		const hashedPassword = await HashString.hash(password);

		try {
			const user = await Account.findOne({ username });
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}
			const isPasswordMatch = await HashString.compare(
				hashedPassword,
				user.password
			);
			if (!isPasswordMatch) {
				return res.status(401).json({ message: "Invalid password" });
			}

			const { password, ...tokenPayload } = user.toObject();

			const token = JsonWebToken.generatePrivateToken(tokenPayload);
			const refreshToken = JsonWebToken.generatePublicToken(tokenPayload);

			res.cookie("REFRESH_TOKEN", refreshToken, {
				httpOnly: true,
				secure: false,
				sameSite: true,
			});

			return res.status(200).json({
				message: "Completed",
				data: {
					...tokenPayload,
					accessToken: token,
				},
			});
		} catch (err) {
			next(err);
		}
	}

	// POST /auth/refresh
	async refresh(req: Request, res: Response, next: NextFunction) {
		try {
			const refreshToken = req.cookies?.REFRESH_TOKEN;
			if (!refreshToken) return res.sendStatus(401);
			const decode = JsonWebToken.verifyPublicToken(refreshToken);
			if (!decode || typeof decode !== "object") {
				return res.sendStatus(403);
			}
			const jwtPayload = decode as JwtPayload;

			// Generate new token
			const { iat, exp, ...tokenPayload } = jwtPayload;
			const newAccessToken = JsonWebToken.generatePrivateToken(tokenPayload);
			const newRefreshToken = JsonWebToken.generatePublicToken(tokenPayload);
			res.set("Access-Control-Allow-Credentials", "true");
			res.cookie("REFRESH_TOKEN", newRefreshToken, {
				expires: new Date(Date.now() + 3600 * 1000 * 24 * 180 * 1),
				sameSite: "none",
				httpOnly: true,
				secure: true,
			});
			return res.json({
				message: "Completed",
				data: {
					...tokenPayload,
					accessToken: newAccessToken,
				},
			});
		} catch (err) {
			next(err);
		}
	}
}
export default AccountController;
