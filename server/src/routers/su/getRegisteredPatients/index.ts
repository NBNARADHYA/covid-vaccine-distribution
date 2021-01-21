import { Router, Request, Response } from "express";
import { getRegisteredPatients } from "../../../models/admin/getRegisteredPatients";

export const getRegisteredPatientsRouter = Router();

getRegisteredPatientsRouter.get(
  "/:adminEmail",
  async (req: Request, res: Response): Promise<Response> => {
    const adminEmail: string = req.params.adminEmail as any;

    if (!adminEmail)
      return res.status(400).send({ error: "adminEmail required" });
    try {
      const patients = await getRegisteredPatients(adminEmail);
      return res.status(200).send({ patients });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
);
