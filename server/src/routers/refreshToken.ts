import { verify } from "jsonwebtoken";
import { Router, Request, Response } from "express";
import { User } from "../entity/User";
import { createAccessToken } from "../utils/createAccessToken";
import { Payload } from "../types/Payload";
import { getConnection } from "typeorm";

const refreshTokenRouter = Router();

refreshTokenRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    const dbConnection = getConnection();

    const token: string = req.cookies.jid;

    if (!token) {
      return res.send({ error: "TOKEN_REQUIRED", accessToken: null });
    }

    try {
      const payload = verify(
        token,
        process.env.REFRESH_TOKEN_SECRET!
      ) as Payload;

      const user = await dbConnection
        .getRepository(User)
        .findOne({ where: { email: payload.email } });

      if (!user) {
        return res.send({ error: "INVALID_USER", accessToken: null });
      }

      return res.send({
        error: null,
        accessToken: createAccessToken({
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
        } as Payload),
      });
    } catch (error) {
      return res.send({ error: "INVALID_TOKEN", accessToken: null });
    }
  }
);

export { refreshTokenRouter };
