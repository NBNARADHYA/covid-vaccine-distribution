import { Router } from "express";
import { registerAndDispatchVaccinesRouter } from "./registerAndDispatchVaccines";
import { signUpAdminRouter } from "./signUpAdmin";

export const superUserRouter = Router();

superUserRouter.use("/signup_admin", signUpAdminRouter);
superUserRouter.use(
  "/register_and_dispatch_vaccines",
  registerAndDispatchVaccinesRouter
);
