import express from "express";
import { refreshTokenRouter } from "./refreshToken";

export const server = express();

server.use("/refresh_token", refreshTokenRouter);
