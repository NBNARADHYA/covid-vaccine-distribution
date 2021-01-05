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
import { registerVaccinationRouter } from "./registerVaccination";
import { logoutRouter } from "./logout";
import { getRegisteredPatientsRouter } from "./getRegisteredPatients";

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
server.use("/register_vaccination", registerVaccinationRouter);
server.use("/logout", logoutRouter);
server.use("/registered_patients", getRegisteredPatientsRouter);
