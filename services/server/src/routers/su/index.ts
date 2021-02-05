import { Router } from "express";
import { getAdminsRouter } from "../getAdmins";
import { getRegisteredPatientsRouter } from "./getRegisteredPatients";
import { registerAndDispatchVaccinesRouter } from "./registerAndDispatchVaccines";

export const superUserRouter = Router();

superUserRouter.use(
  "/register_and_dispatch_vaccines",
  registerAndDispatchVaccinesRouter
);
superUserRouter.use("/admins", getAdminsRouter);
superUserRouter.use(
  "/admins/:adminEmail/registered_patients",
  getRegisteredPatientsRouter
);
