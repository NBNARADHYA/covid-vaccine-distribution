import { NextFunction, Request, Response } from "express";

export const verifySuperUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  if (!req.user.isSuperUser)
    return res.status(400).send({ error: "Not authorized" });

  return next();
};
