import { hash } from "bcryptjs";
import { getConnection } from "typeorm";
import { User } from "../../../entity/User";
import { sendMail } from "../../utils/sendMail";
import { v4 as genHash } from "uuid";

export interface SignUpProps {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
  lat: number;
  lng: number;
  isRoot?: boolean;
  isSuperUser?: boolean;
  isAdmin?: boolean;
}

export const signUp = async ({
  firstName,
  lastName,
  email,
  password,
  lat,
  lng,
  isRoot,
  isAdmin,
  isSuperUser,
}: SignUpProps): Promise<boolean> => {
  const dbConnection = getConnection();

  const user = new User();

  user.email = email;

  const hashedPassword = await hash(password, 10);
  user.password = hashedPassword;

  user.firstName = firstName;
  if (lastName) user.lastName = lastName;

  user.location = {
    type: "Point",
    coordinates: [lat, lng],
  };

  if (isRoot) user.isRoot = true;
  if (isSuperUser) user.isSuperUser = true;
  if (isAdmin) user.isAdmin = true;

  const verifyEmailHash = genHash();
  user.verifyEmailHash = verifyEmailHash;

  try {
    await dbConnection.getRepository(User).insert(user);
  } catch (error) {
    throw new Error(error);
  }

  sendMail({
    to: email,
    html: `<div>Click 
            <a href="${process.env.WEB}/auth/verify_email?verify_email_hash=${verifyEmailHash}">here</a>
            to verify your email
          </div>`,
    subject: "Verify your email",
  }).catch(console.error);

  console.log(verifyEmailHash);

  return true;
};
