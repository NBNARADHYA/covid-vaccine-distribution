import { Request, Response, Router } from "express";
import { registerAndDispatchVaccines } from "../../../models/su/registerAndDispatchVaccines";

export const registerAndDispatchVaccinesRouter = Router();

registerAndDispatchVaccinesRouter.post(
  "/",
  async (req: Request, res: Response): Promise<Response> => {
    if (!req.body.numVaccines) {
      return res.status(400).json({ error: "numVaccines required" });
    } else if (isNaN(req.body.numVaccines))
      return res.status(400).json({ error: "Invalid numVaccines" });

    try {
      await registerAndDispatchVaccines(
        req.body.numVaccines,
        req.user.location
      );
      return res.status(200).send({ success: true });
    } catch (error) {
      return res.status(500).send({ errors: [error.message] });
    }
  }
);
