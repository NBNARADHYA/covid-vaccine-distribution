import { Router } from "express";
import { getNonScheduledPatientsRouter } from "./getNonScheduledPatients";
import { getRegisteredPatientsRouter } from "./getRegisteredPatients";
import { scheduleVaccinationRouter } from "./scheduleVaccination";

export const adminRouter = Router();

adminRouter.use("/schedule_vaccination", scheduleVaccinationRouter);
adminRouter.use("/registered_patients", getRegisteredPatientsRouter);
adminRouter.use("/non_scheduled_patients", getNonScheduledPatientsRouter);
