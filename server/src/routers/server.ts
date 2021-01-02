import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { refreshTokenRouter } from "./refreshToken";
import { signUpRouter } from "./signUp/signUp";
import { verifyEmailRouter } from "./verifyEmail";
import { loginRouter } from "./login";
import { addPatientProfileRouter } from "./addPatientProfile";
import { signUpAdminRouter } from "./signUpAdmin";

export const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

server.use("/signup", signUpRouter);
server.use("/refresh_token", refreshTokenRouter);
server.use("/verify_email", verifyEmailRouter);
server.use("/login", loginRouter);
server.use("/add_patient_profile", addPatientProfileRouter);
server.use("/signup_admin", signUpAdminRouter);
