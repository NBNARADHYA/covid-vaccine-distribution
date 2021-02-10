import { Router, Request, Response } from "express";
import { getRegisteredPatients } from "../../../models/admin/getRegisteredPatients";

export const getRegisteredPatientsRouter = Router({ mergeParams: true });

getRegisteredPatientsRouter.get(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    const adminEmail: string = req.params.adminEmail as any;
    const { lastNumDays, nextNumDays } = req.query;

    if (!adminEmail)
      return res.status(400).send({ error: "adminEmail required" });
    try {
      const patients = await getRegisteredPatients(
        adminEmail,
        parseInt(lastNumDays as string),
        parseInt(nextNumDays as string)
      );
      return res.status(200).send({ patients });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
);
