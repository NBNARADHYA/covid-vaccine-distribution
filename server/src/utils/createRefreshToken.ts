import { sign } from "jsonwebtoken";
import { Payload } from "../types/Payload";

export const createRefreshToken = (payload: Payload): string =>
  sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "7d" });
