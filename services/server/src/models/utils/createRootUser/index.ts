import { getConnection } from "typeorm";
import { User } from "../../../entity/User";
import { signUp } from "../../auth/signUp";

export const createRootUser = async (): Promise<boolean> => {
  const dbConnection = getConnection();

  const rootEmail = process.env.ROOT_EMAIL;

  if (!rootEmail) return false;

  try {
    let rootUser = await dbConnection
      .getRepository(User)
      .findOne({ email: rootEmail, isRoot: true });

    if (rootUser) return false;

    const rootPassword = process.env.ROOT_PASSWORD;

    if (!rootPassword) return false;

    await signUp({
      firstName: "Root",
      lastName: "User",
      email: rootEmail,
      password: rootPassword,
      lat: 12.9716,
      lng: 77.5946,
      isRoot: true,
    });

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
