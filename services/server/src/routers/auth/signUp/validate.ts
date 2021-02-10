import { SignUpProps } from "../../../models/auth/signUp";
import { isEmail } from "../../utils/isEmail";

export const validate = ({
  email,
  firstName,
  password,
  lat,
  lng,
}: SignUpProps): string[] => {
  const errors: string[] = [];

  if (!email) {
    errors.push("email required");
  } else if (!isEmail(email)) errors.push("Invalid email");

  if (!firstName) errors.push("firstName required");

  if (!password) {
    errors.push("password requried");
  } else if (password.length < 5) errors.push("Invalid password");

  if (!lat) {
    errors.push("lat required");
  } else if (isNaN(lat)) errors.push("invalid lat");

  if (!lng) {
    errors.push("lng required");
  } else if (isNaN(lng)) errors.push("invalid lng");

  return errors;
};
