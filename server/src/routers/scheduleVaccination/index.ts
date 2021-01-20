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
    try {
      await scheduleVaccination(req.user.id);
      return res.status(200).send({ success: true });
    } catch (error) {
      return res.status(500).send({ errors: [error.message] });
    }
  }
);
