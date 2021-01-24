import { useContext } from "react";
import { AccessTokenContext } from "../Contexts/AccessToken";

export const Home = ({ history }) => {
  const {
    accessToken,
    user: { isAdmin, isSuperUser },
  } = useContext(AccessTokenContext);

  console.log(isAdmin, isSuperUser);

  if (!accessToken) {
    history.push("/auth/login");
  } else if (isSuperUser) {
    history.push("/su/dashboard");
  } else if (isAdmin) {
    history.push("/admin/dashboard");
  } else {
    history.push("/user/dashboard");
  }

  return null;
};
