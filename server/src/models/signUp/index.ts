import { hash } from "bcryptjs";
import { getConnection } from "typeorm";
import { User } from "../../entity/User";

export interface SignUpProps {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export const signUp = async ({
  firstName,
  lastName,
  email,
  password,
}: SignUpProps): Promise<boolean> => {
  const dbConnection = getConnection();

  const hashedPassword = await hash(password, 10);

  const user = new User();
  user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  user.email = email;
  user.password = hashedPassword;

  try {
    await dbConnection.getRepository(User).insert(user);
  } catch (error) {
    throw new Error(error);
  }

  return true;
};
