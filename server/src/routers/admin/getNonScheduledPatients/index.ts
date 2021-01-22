import { Request, Response, Router } from "express";
import { getNonScheduledPatients } from "../../../models/admin/getNonScheduledPatients";

export const getNonScheduledPatientsRouter = Router();

getNonScheduledPatientsRouter.get(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const patients = await getNonScheduledPatients(req.user.email);
      return res.status(200).send({ patients });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
);
