import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { refreshTokenRouter } from "./refreshToken";
import { signUpRouter } from "./signUp/signUp";
import { verifyEmailRouter } from "./verifyEmail";
import { loginRouter } from "./login";
import { addPatientProfileRouter } from "./addPatientProfile";
import { signUpAdminRouter } from "./signUpAdmin";
import cors from "cors";
import { scheduleVaccinationRouter } from "./scheduleVaccination";
import { logoutRouter } from "./logout";
import { getRegisteredPatientsRouter } from "./getRegisteredPatients";
import { registerAndDispatchVaccinesRouter } from "./registerAndDispatchVaccines";

export const server = express();

server.use(
  cors({
    credentials: true,
    origin: `${process.env.WEB}`,
  })
);

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cookieParser());

server.use("/signup", signUpRouter);
server.use("/refresh_token", refreshTokenRouter);
server.use("/verify_email", verifyEmailRouter);
server.use("/login", loginRouter);
server.use("/add_patient_profile", addPatientProfileRouter);
server.use("/signup_admin", signUpAdminRouter);
server.use("/schedule_vaccination", scheduleVaccinationRouter);
server.use("/logout", logoutRouter);
server.use("/registered_patients", getRegisteredPatientsRouter);
server.use(
  "/register_and_dispatch_vaccines",
  registerAndDispatchVaccinesRouter
);
