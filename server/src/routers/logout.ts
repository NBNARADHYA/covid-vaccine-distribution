import { Response, Router } from "express";
import { logout } from "../models/logout";

export const logoutRouter = Router();

logoutRouter.post(
  "/",
  (_, res: Response): Response => {
    logout(res);
    return res.status(200).send({ success: true });
  }
);
