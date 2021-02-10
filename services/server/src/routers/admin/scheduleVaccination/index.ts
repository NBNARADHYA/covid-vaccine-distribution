import { Request, Response, Router } from "express";
import { scheduleVaccination } from "../../../models/admin/scheduleVaccination";

export const scheduleVaccinationRouter = Router();

scheduleVaccinationRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    if (req.user.isSuperUser) {
      return res.status(400).send({ error: "Unauthorized" });
    }

    const { patientsPerSlot } = req.body;
    const { email } = req.user;

    if (!patientsPerSlot)
      return res.status(400).send({ error: "PatientsPerSlot is required" });
    else if (
      isNaN(patientsPerSlot) ||
      patientsPerSlot < 0 ||
      !Number.isInteger(patientsPerSlot)
    )
      return res.status(400).send({ error: "Invalid PatientsPerSlot" });

    try {
      const scheduledPatients = await scheduleVaccination(
        email,
        patientsPerSlot
      );
      return res.status(200).send({ scheduledPatients });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
);
