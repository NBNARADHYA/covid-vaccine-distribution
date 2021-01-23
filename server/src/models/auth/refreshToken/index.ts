import { verify } from "jsonwebtoken";
import { getConnection } from "typeorm";
import { User } from "../../../entity/User";
import { Payload } from "../../../types/Payload";
import { createAccessToken } from "../../utils/createAccessToken";

export const refreshToken = async (token: string): Promise<string> => {
  const dbConnection = getConnection();

  try {
    const payload = verify(token, process.env.REFRESH_TOKEN_SECRET!) as Payload;

    const user = await dbConnection
      .getRepository(User)
      .findOne({ email: payload.email, isVerified: true });

    if (!user) {
      throw new Error("INVALID_USER");
    }

    return createAccessToken({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: !!user.isAdmin,
      isSuperUser: !!user.isSuperUser,
      isProfileAdded:
        user.covidVulnerabilityScore !== null &&
        user.covidVulnerabilityScore !== undefined,
      vaccinationDate: user.vaccinationDate,
      location: user.location,
    } as Payload);
  } catch (error) {
    throw new Error("INVALID_TOKEN");
  }
};
