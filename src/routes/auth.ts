import express from "express";
import AccountController from "../controllers/AccountController";

const authRouter = express.Router();
const accountController = new AccountController();

authRouter.post("/login", accountController.login);
authRouter.post("/register", accountController.register);
authRouter.post("/refresh", accountController.refresh);

export default authRouter;
