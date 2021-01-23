import { Router, Response } from "express";
import { getAdmins } from "../../models/getAdmins";

export const getAdminsRouter = Router();

getAdminsRouter.get(
  "/",
  async (_, res: Response): Promise<Response> => {
    try {
      const admins = await getAdmins();
      return res.status(200).send({ admins });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
);
