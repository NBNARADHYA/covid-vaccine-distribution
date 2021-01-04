import { Request, Response, Router } from "express";
import { verifyAdmin } from "../../models/middlewares/verifyAdmin";
import { verifyUser } from "../../models/middlewares/verifyUser";
import { registerVaccination } from "../../models/registerVaccination";
import { isDate } from "../utils/isDate";

export const registerVaccinationRouter = Router();

registerVaccinationRouter.post(
  "/",
  verifyUser,
  verifyAdmin,
  async (req: Request, res: Response): Promise<Response> => {
    const { numVaccines, dateOfVaccination } = req.body;

    const errors: string[] = [];

    if (numVaccines === undefined || numVaccines === null) {
      errors.push("numVaccines required");
    } else if (isNaN(numVaccines)) errors.push("Invalid numVaccines");

    if (!dateOfVaccination) {
      errors.push("dateOfVaccination required");
    } else if (
      !isDate(new Date(dateOfVaccination)) ||
      new Date(dateOfVaccination).getTime() <= Date.now()
    )
      errors.push("Invalid dateOfVaccination");

    try {
      await registerVaccination({
        numVaccines,
        dateOfVaccination,
        adminLocation: req.user.state,
      });
      return res.status(200).send({ success: true });
    } catch (error) {
      return res.status(500).send({ errors: [error.message] });
    }
  }
);
