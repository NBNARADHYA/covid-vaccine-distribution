import { NextFunction, Request, Response } from "express";

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  if (!req.user.isAdmin)
    return res.status(400).send({ error: "Not authorized" });

  return next();
};
