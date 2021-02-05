import { Router } from "express";
import { loginRouter } from "./login";
import { logoutRouter } from "./logout";
import { refreshTokenRouter } from "./refreshToken";
import { signUpRouter } from "./signUp/signUp";
import { verifyEmailRouter } from "./verifyEmail";

export const authRouter = Router();

authRouter.use("/login", loginRouter);
authRouter.use("/signup", signUpRouter);
authRouter.use("/refresh_token", refreshTokenRouter);
authRouter.use("/verify_email", verifyEmailRouter);
authRouter.use("/logout", logoutRouter);
