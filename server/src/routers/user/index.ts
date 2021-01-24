import { Router } from "express";
import { addProfileRouter } from "./addProfile";

export const userRouter = Router();

userRouter.use("/patient_profile", addProfileRouter);
