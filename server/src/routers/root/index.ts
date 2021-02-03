import { Router } from "express";
import { experimentalRootRouter } from "./experimental";
import { signUpAdminRouter } from "./signUpAdmin";
import { signUpSuperUserRouter } from "./signUpSuperUser";

export const rootRouter = Router();

rootRouter.use("/experimental", experimentalRootRouter);
rootRouter.use("/admin", signUpAdminRouter);
rootRouter.use("/su", signUpSuperUserRouter);
