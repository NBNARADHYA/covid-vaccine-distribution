import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { getConnection } from "typeorm";
import { User } from "../../entity/User";
import { Payload } from "../../types/Payload";

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  if (!req.headers.authorization)
    return res.status(400).send({ error: "Authorization needed" });

  const authorization = req.headers.authorization.split(" ");

  if (authorization.length !== 2)
    return res.status(400).send({ error: "Authorization needed" });

  const token = authorization[1];

  try {
    const { email } = verify(
      token!,
      process.env.ACCESS_TOKEN_SECRET!
    ) as Payload;

    const dbConnection = getConnection();

    const user = await dbConnection
      .getRepository(User)
      .findOne({ email, isVerified: true });

    if (!user) return res.status(400).send({ error: "Not authorized" });

    req.user = user;

    return next();
  } catch {
    return res.status(400).send({ error: "Not authorized" });
  }
};
