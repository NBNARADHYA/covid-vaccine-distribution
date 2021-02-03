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
  password,
  lat,
  lng,
  isRoot,
  ...restUserDetails
}: SignUpProps): Promise<boolean> => {
  const dbConnection = getConnection();

  let user = new User();

  user = Object.assign<User, typeof restUserDetails>(user, restUserDetails);

  const hashedPassword = await hash(password, 10);
  user.password = hashedPassword;

  user.location = {
    type: "Point",
    coordinates: [lat, lng],
  };

  if (isRoot) {
    user.isRoot = true;
    user.isVerified = true;
  }

  const verifyEmailHash = genHash();
  user.verifyEmailHash = verifyEmailHash;

  try {
    await dbConnection.getRepository(User).insert(user);
  } catch (error) {
    throw new Error(error);
  }

  !isRoot &&
    sendMail({
      to: restUserDetails.email,
      html: `<div>Click 
            <a href="${process.env.WEB}/auth/verify_email?verify_email_hash=${verifyEmailHash}">here</a>
            to verify your email
          </div>`,
      subject: "Verify your email",
    }).catch(console.error);

  return true;
};
