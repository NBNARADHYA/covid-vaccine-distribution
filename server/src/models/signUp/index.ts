import { hash } from "bcryptjs";
import { getConnection } from "typeorm";
import { User } from "../../entity/User";
import { sendMail } from "../utils/sendMail";
import { v4 as genHash } from "uuid";

export interface SignUpProps {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  state: number;
}

export const signUp = async ({
  firstName,
  lastName,
  email,
  password,
  state,
}: SignUpProps): Promise<boolean> => {
  const dbConnection = getConnection();

  const hashedPassword = await hash(password, 10);

  const verifyEmailHash = genHash();

  const user = new User();
  user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  user.email = email;
  user.password = hashedPassword;
  user.state = state;
  user.verifyEmailHash = verifyEmailHash;

  try {
    await dbConnection.getRepository(User).insert(user);
  } catch (error) {
    throw new Error(error);
  }

  sendMail({
    to: email,
    html: `<div>Click 
            <a href="${process.env.WEB}/verify_email?verify_email_hash=${verifyEmailHash}">here</a>
            to verify your email
          </div>`,
    subject: "Verify your email",
  }).catch(console.error);

  console.log(verifyEmailHash);

  return true;
};
