import { compare } from "bcryptjs";
import { Response } from "express";
import { getConnection } from "typeorm";
import { User } from "../../../entity/User";
import { Payload } from "../../../types/Payload";
import { createAccessToken } from "../../utils/createAccessToken";
import { createRefreshToken } from "../../utils/createRefreshToken";

export interface LoginProps {
  email: string;
  password: string;
  res: Response;
}

export const login = async ({
  email,
  password,
  res,
}: LoginProps): Promise<{ accessToken: string }> => {
  const dbConnection = getConnection();

  const user = await dbConnection
    .getRepository(User)
    .findOne({ email, isVerified: true });

  if (!user) {
    throw new Error("Invalid user");
  }

  const isPasswordValid = await compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const payload: Payload = {
    email,
    firstName: user.firstName,
    lastName: `${user.lastName}`,
    isAdmin: !!user.isAdmin,
    isSuperUser: !!user.isSuperUser,
    isProfileAdded:
      user.covidVulnerabilityScore !== null &&
      user.covidVulnerabilityScore !== undefined,
    vaccinationDate: user.vaccinationDate,
    location: user.location,
  };

  const accessToken = createAccessToken(payload);

  const refreshToken = createRefreshToken(payload);

  res.cookie("jid", refreshToken, {
    httpOnly: true,
    path: "/auth/refresh_token",
  });

  return { accessToken };
};
