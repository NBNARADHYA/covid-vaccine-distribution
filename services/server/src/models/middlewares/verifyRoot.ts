import { NextFunction, Request, Response } from "express";

export const verifyRoot = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  if (!req.user.isRoot)
    return res.status(400).send({ error: "Not authorized" });

  return next();
};
