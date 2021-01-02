import { Request, Response, Router } from "express";
import { signUp, SignUpProps } from "../models/signUp";
import { isEmail } from "../models/utils/isEmail";

export const signUpRouter = Router();

signUpRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    const {
      email,
      firstName,
      lastName,
      password,
      state,
    }: SignUpProps = req.body;

    const errors: string[] = [];

    if (!email) {
      errors.push("email required");
    } else if (!isEmail(email)) errors.push("Invalid email");

    if (!firstName) errors.push("firstName required");

    if (!password) {
      errors.push("password requried");
    } else if (password.length < 5) errors.push("Invalid password");

    if (!state) {
      errors.push("state required");
    } else if (isNaN(state)) errors.push("invalid state");

    if (errors.length) {
      return res.status(400).send({ errors });
    }

    try {
      await signUp({ firstName, lastName, email, password, state });
    } catch (error) {
      error = error.message;
      if (error.includes("duplicate key")) error = "User already exists";

      return res.status(400).send({ errors: [error] });
    }

    return res.status(200).send({ success: true });
  }
);
