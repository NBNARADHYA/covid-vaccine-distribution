import { Router } from "express";
import { experimentalRootRouter } from "./experimental";
import { signUpAdminRouter } from "./signUpAdmin";

export const rootRouter = Router();

rootRouter.use("/experimental", experimentalRootRouter);
rootRouter.use("/admin", signUpAdminRouter);
