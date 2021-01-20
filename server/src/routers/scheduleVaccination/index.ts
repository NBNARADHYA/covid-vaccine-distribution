import { Request, Response, Router } from "express";
import { verifyAdmin } from "../../models/middlewares/verifyAdmin";
import { verifyUser } from "../../models/middlewares/verifyUser";
import { scheduleVaccination } from "../../models/scheduleVaccination";

export const scheduleVaccinationRouter = Router();

scheduleVaccinationRouter.post(
  "/",
  verifyUser,
  verifyAdmin,
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
