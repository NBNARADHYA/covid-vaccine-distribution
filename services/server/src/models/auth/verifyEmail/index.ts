import { getConnection } from "typeorm";
import { User } from "../../../entity/User";

export const verifyEmail = async (
  verifyEmailHash: string
): Promise<boolean> => {
  const dbConnection = getConnection();

  try {
    await dbConnection
      .getRepository(User)
      .update(
        { verifyEmailHash, isVerified: false },
        { verifyEmailHash: undefined, isVerified: true }
      );
  } catch (error) {
    throw new Error(error);
  }
  return true;
};
