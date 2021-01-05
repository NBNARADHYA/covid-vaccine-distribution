import { Request, Response, Router } from "express";
import { getRegisteredPatients } from "../../models/getRegisteredPatients";
import { verifyAdmin } from "../../models/middlewares/verifyAdmin";
import { verifyUser } from "../../models/middlewares/verifyUser";

export const getRegisteredPatientsRouter = Router();

getRegisteredPatientsRouter.post(
  "/",
  verifyUser,
  verifyAdmin,
  async (req: Request, res: Response): Promise<Response> => {
    try {
      const patients = await getRegisteredPatients(req.user.state);
      return res.status(200).send({ patients });
    } catch (error) {
      return res.status(500).send({ errors: [error.message] });
    }
  }
);
