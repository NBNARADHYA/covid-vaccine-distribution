import { Response } from "express";

export const logout = (res: Response): boolean => {
  res.clearCookie("jid");
  return true;
};
