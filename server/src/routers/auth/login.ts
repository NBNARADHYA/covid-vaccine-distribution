import { Request, Response, Router } from "express";
import { login } from "../../models/auth/login";
import { isEmail } from "../utils/isEmail";

export const loginRouter = Router();

loginRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    const errors = [];

    const { email, password } = req.body;

    if (!email) {
      errors.push("email required");
    } else if (!isEmail(email)) errors.push("Invalid email");

    if (!password) errors.push("password required");

    if (errors.length) res.status(400).send({ errors });

    try {
      const { accessToken } = await login({ email, password, res });
      return res.status(200).send({ accessToken });
    } catch (error) {
      return res.status(400).send({ errors: [error.message] });
    }
  }
);
