import { Router, Response, Request } from "express";
import { getPatientTrend } from "../../models/getPatientTrend";

export const getPatientTrendRouter = Router();

getPatientTrendRouter.get(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    let { lastNumDays, nextNumDays } = req.query;
    try {
      const patients = await getPatientTrend(
        parseInt(lastNumDays as string),
        parseInt(nextNumDays as string)
      );
      return res.status(200).send({ patients });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }
);
