import { Request, Response, Router } from "express";
import { getRegisteredPatients } from "../../../models/admin/getRegisteredPatients";

export const getRegisteredPatientsRouter = Router();

getRegisteredPatientsRouter.get(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    const { lastNumDays, nextNumDays } = req.query;
    try {
      const patients = await getRegisteredPatients(
        req.user.email,
        parseInt(lastNumDays as string),
        parseInt(nextNumDays as string)
      );
      return res.status(200).send({ patients });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
);
