import { Router, Request, Response } from "express";
import { refreshToken } from "../../models/auth/refreshToken";

const refreshTokenRouter = Router();

refreshTokenRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    const token: string = req.cookies.jid;

    if (!token) {
      return res
        .status(400)
        .send({ error: "TOKEN_REQUIRED", accessToken: null });
    }

    try {
      const accessToken = await refreshToken(token);
      return res.send({ error: null, accessToken });
    } catch (error) {
      return res.status(400).send({ error: error.message, accessToken: null });
    }
  }
);

export { refreshTokenRouter };
