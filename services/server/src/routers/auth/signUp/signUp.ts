import { Request, Response, Router } from "express";
import { signUp } from "../../../models/auth/signUp";
import { validate } from "./validate";

export const signUpRouter = Router();

signUpRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    const errors: string[] = validate(req.body);

    if (errors.length) return res.status(400).send({ errors });

    try {
      await signUp(req.body);

      return res.status(200).send({ success: true });
    } catch (error) {
      error = error.message;

      if (error.includes("duplicate key")) error = "User already exists";

      return res.status(400).send({ errors: [error] });
    }
  }
);
