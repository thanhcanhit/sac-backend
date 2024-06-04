import { NextFunction, Request, Response } from "express";
import JsonWebToken from "../utils/JsonWebToken";

class MiddlewareController {
  constructor() {
    this.verifyToken = this.verifyToken.bind(this);
    this.verifyAdminToken = this.verifyAdminToken.bind(this);
  }

  verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const author = req.headers.authorization;
      if (!author) return res.sendStatus(401);

      // Check token is valid
      try {
        const token = author.split(" ")[1];
        console.log(token);
        const decode = JsonWebToken.verifyPrivateToken(token);
        req.body.decodeData = decode;
        next();
      } catch (invalidTokenErr) {
        res.status(403).json({ message: "Invalid token" });
      }
    } catch (err) {
      next(err);
    }
  }

  verifyAdminToken(req: Request, res: Response, next: NextFunction) {
    this.verifyToken(req, res, () => {
      if (!(req.body.decodeData?.role === "admin")) {
        return res.sendStatus(403);
      }
      next();
    });
  }
}

export default MiddlewareController;
