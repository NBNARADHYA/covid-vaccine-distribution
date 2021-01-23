import { Request, Response, Router } from "express";
import { verifyEmail } from "../../models/auth/verifyEmail";

export const verifyEmailRouter = Router();

verifyEmailRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    const verifyEmailHash = req.body.verify_email_hash;
    if (!verifyEmailRouter)
      return res.status(404).send({ error: "Invalid url" });

    try {
      await verifyEmail(verifyEmailHash);
    } catch (error) {
      return res.send(400).send({ error: "Invalid url" });
    }

    return res.status(200).send({ success: true });
  }
);
