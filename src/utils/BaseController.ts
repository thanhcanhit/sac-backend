import { Request, Response } from "express";

interface IBaseController {
  getAll(req: Request, res: Response): Promise<void>;
  getById(req: Request, res: Response): Promise<void>;
  create(req: Request, res: Response): Promise<void>;
  update(req: Request, res: Response): Promise<void>;
  delete(req: Request, res: Response): Promise<void>;
}

export default IBaseController;
