import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import { adminRouter } from "./admin";
import { verifyUser } from "../models/middlewares/verifyUser";
import { verifyAdmin } from "../models/middlewares/verifyAdmin";
import { verifySuperUser } from "../models/middlewares/verifySuperUser";
import { superUserRouter } from "./su";
import { userRouter } from "./user";
import { authRouter } from "./auth";
import { getAdminsRouter } from "./getAdmins";
import { getPatientTrendRouter } from "./getPatientTrend";
import { verifyRoot } from "../models/middlewares/verifyRoot";
import { rootRouter } from "./root";

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

server.use("/root", verifyUser, verifyRoot, rootRouter);
server.use("/admin", verifyUser, verifyAdmin, adminRouter);
server.use("/su", verifyUser, verifySuperUser, superUserRouter);
server.use("/user", verifyUser, userRouter);
server.use("/auth", authRouter);
server.use("/admins", getAdminsRouter);
server.use("/patient_trend", getPatientTrendRouter);
