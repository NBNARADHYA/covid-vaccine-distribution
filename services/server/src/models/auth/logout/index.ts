import { Response } from "express";

export const logout = (res: Response): boolean => {
  res.clearCookie("jid", {
    httpOnly: true,
    path: "/auth/refresh_token",
  });
  return true;
};
