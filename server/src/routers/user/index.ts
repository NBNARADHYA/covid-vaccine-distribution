import { Router } from "express";
import { addProfileRouter } from "./addProfile";
import { logoutRouter } from "./logout";

export const userRouter = Router();

userRouter.use("/logout", logoutRouter);
userRouter.use("/patient_profile", addProfileRouter);
