import { useContext } from "react";
import { AccessTokenContext } from "../Contexts/AccessToken";

export const Home = ({ history }) => {
  const {
    accessToken,
    user: { isAdmin },
  } = useContext(AccessTokenContext);

  if (isAdmin) {
    history.push("/admin/dashboard");
  } else if (!accessToken) {
    history.push("/auth/login");
  } else {
    history.push("/user/dashboard");
  }
  return null;
};
