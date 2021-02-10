import { Request, Response, Router } from "express";
import { addPatientProfile } from "../../../models/user/addPatientProfile";
import { verifyUser } from "../../../models/middlewares/verifyUser";
import { validate } from "./validate";

export const addProfileRouter = Router();

addProfileRouter.post(
  "/",
  verifyUser,
  async (req: Request, res: Response): Promise<Response> => {
    const errors: string[] = validate(req.body);

    if (errors.length) return res.status(400).send({ errors });

    try {
      await addPatientProfile({ ...req.body, user: req.user });
      return res.status(200).send({ success: true });
    } catch (error) {
      return res.status(500).send({ errors: [error.message] });
    }
  }
);
