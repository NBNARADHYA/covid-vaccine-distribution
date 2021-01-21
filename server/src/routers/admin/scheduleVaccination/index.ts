import { Request, Response, Router } from "express";
import { scheduleVaccination } from "../../../models/admin/scheduleVaccination";

export const scheduleVaccinationRouter = Router();

scheduleVaccinationRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    if (req.user.isSuperUser) {
      return res.status(400).send({ errors: ["Unauthorized"] });
    }

    const { patientsPerSlot } = req.body;
    const { email } = req.user;

    if (!patientsPerSlot)
      return res.status(400).send({ errors: ["PatientsPerSlot is required"] });
    else if (
      isNaN(patientsPerSlot) ||
      patientsPerSlot < 0 ||
      !Number.isInteger(patientsPerSlot)
    )
      return res.status(400).send({ errors: ["Invalid PatientsPerSlot"] });

    try {
      await scheduleVaccination(email, patientsPerSlot);
      return res.status(200).send({ success: true });
    } catch (error) {
      return res.status(500).send({ errors: [error.message] });
    }
  }
);
