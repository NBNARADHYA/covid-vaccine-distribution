import { Request, Response, Router } from "express";
import { verifySuperUser } from "../models/middlewares/verifySuperUser";
import { verifyUser } from "../models/middlewares/verifyUser";
import { signUpAdmin } from "../models/signUpAdmin";
import { validate } from "./signUp/validate";

export const signUpAdminRouter = Router();

signUpAdminRouter.post(
  "/",
  verifyUser,
  verifySuperUser,
  async (req: Request, res: Response): Promise<Response> => {
    const errors: string[] = validate(req.body);

    if (errors.length) return res.status(400).send({ errors });

    try {
      await signUpAdmin(req.body);

      return res.status(200).send({ success: true });
    } catch (error) {
      error = error.message;

      if (error.includes("duplicate key")) error = "User already exists";

      return res.status(400).send({ errors: [error] });
    }
  }
);
