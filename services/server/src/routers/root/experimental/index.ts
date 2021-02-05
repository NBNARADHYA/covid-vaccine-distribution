import { Router } from "express";
import { signUpRandomAdminsUsersRouter } from "./signUpRandomAdminsUsers";

export const experimentalRootRouter = Router();

experimentalRootRouter.use(
  "/random_admins_users",
  signUpRandomAdminsUsersRouter
);
