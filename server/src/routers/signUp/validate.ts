import { SignUpProps } from "../../models/signUp";
import { isEmail } from "../utils/isEmail";

export const validate = ({
  email,
  firstName,
  password,
  state,
}: SignUpProps): string[] => {
  const errors: string[] = [];

  if (!email) {
    errors.push("email required");
  } else if (!isEmail(email)) errors.push("Invalid email");

  if (!firstName) errors.push("firstName required");

  if (!password) {
    errors.push("password requried");
  } else if (password.length < 5) errors.push("Invalid password");

  if (!state) {
    errors.push("state required");
  } else if (isNaN(state)) errors.push("invalid state");

  return errors;
};
