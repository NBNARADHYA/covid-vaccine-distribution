import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { refreshTokenRouter } from "./refreshToken";
import { signUpRouter } from "./signUp";

export const server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

server.use("/signup", signUpRouter);
server.use("/refresh_token", refreshTokenRouter);
