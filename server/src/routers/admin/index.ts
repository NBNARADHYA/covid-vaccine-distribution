import { Router } from "express";
import { getRegisteredPatientsRouter } from "./getRegisteredPatients";
import { scheduleVaccinationRouter } from "./scheduleVaccination";

export const adminRouter = Router();

adminRouter.use("/schedule_vaccination", scheduleVaccinationRouter);
adminRouter.use("/registered_patients", getRegisteredPatientsRouter);
