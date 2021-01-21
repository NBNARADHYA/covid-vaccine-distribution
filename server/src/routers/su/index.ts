import { Router } from "express";
import { getAdminsRouter } from "./getAdmins";
import { getRegisteredPatientsRouter } from "./getRegisteredPatients";
import { registerAndDispatchVaccinesRouter } from "./registerAndDispatchVaccines";
import { signUpAdminRouter } from "./signUpAdmin";

export const superUserRouter = Router();

superUserRouter.use("/signup_admin", signUpAdminRouter);
superUserRouter.use(
  "/register_and_dispatch_vaccines",
  registerAndDispatchVaccinesRouter
);
superUserRouter.use("/registered_patients", getRegisteredPatientsRouter);
superUserRouter.use("/admins", getAdminsRouter);
