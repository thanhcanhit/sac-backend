import express, { NextFunction, Request, Response } from "express";

const publicRouter = express.Router();

publicRouter.post(
  "/public/:path*",
  (req: Request, res: Response, next: NextFunction) => {
    const { path } = req.params;
    console.log("PATH");
    res.status(200).sendFile(path);
  },
);

export default publicRouter;
