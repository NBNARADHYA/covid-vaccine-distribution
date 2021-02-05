import { Point } from "geojson";
import { getConnection } from "typeorm";
import { User } from "../../entity/User";

interface AdminType {
  email: string;
  location: Point;
  firstName: string;
  lastName?: string;
}

export const getAdmins = async (): Promise<AdminType[]> => {
  const dbConnection = getConnection();

  try {
    const admins = await dbConnection
      .getRepository(User)
      .find({ isVerified: true, isAdmin: true });

    return admins.map(({ email, firstName, lastName, location }) => ({
      email,
      firstName,
      lastName,
      location,
    }));
  } catch (error) {
    throw new Error("Internal server error");
  }
};
