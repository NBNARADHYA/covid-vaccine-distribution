import { signUp, SignUpProps } from "../../auth/signUp";

export const signUpAdmin = async (user: SignUpProps): Promise<boolean> => {
  try {
    return await signUp({ ...user, isAdmin: true });
  } catch (error) {
    throw new Error(error.message);
  }
};
