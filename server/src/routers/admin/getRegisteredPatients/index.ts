import { Request, Response, Router } from "express";
import { getRegisteredPatients } from "../../../models/admin/getRegisteredPatients";

export const getRegisteredPatientsRouter = Router();

getRegisteredPatientsRouter.get(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const patients = await getRegisteredPatients(req.user.email);
      return res.status(200).send({ patients });
    } catch (error) {
      return res.status(500).send({ errors: [error.message] });
    }
  }
);
