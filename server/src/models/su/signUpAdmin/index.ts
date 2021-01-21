import { getConnection } from "typeorm";
import { User } from "../../../entity/User";
import { signUp, SignUpProps } from "../../signUp";

export const signUpAdmin = async (user: SignUpProps): Promise<boolean> => {
  try {
    await signUp(user);

    const dbConnection = getConnection();

    await dbConnection
      .getRepository(User)
      .update({ email: user.email }, { isAdmin: true });

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
