import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { refreshTokenRouter } from "./refreshToken";
import { signUpRouter } from "./signUp/signUp";
import { verifyEmailRouter } from "./verifyEmail";
import { loginRouter } from "./login";
import { addPatientProfileRouter } from "./addPatientProfile";
import cors from "cors";
import { logoutRouter } from "./logout";
import { adminRouter } from "./admin";
import { verifyUser } from "../models/middlewares/verifyUser";
import { verifyAdmin } from "../models/middlewares/verifyAdmin";
import { verifySuperUser } from "../models/middlewares/verifySuperUser";
import { superUserRouter } from "./su";

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

server.use("/admin", verifyUser, verifyAdmin, adminRouter);
server.use("/su", verifyUser, verifySuperUser, superUserRouter);
server.use("/signup", signUpRouter);
server.use("/refresh_token", refreshTokenRouter);
server.use("/verify_email", verifyEmailRouter);
server.use("/login", loginRouter);
server.use("/add_patient_profile", addPatientProfileRouter);
server.use("/logout", logoutRouter);
