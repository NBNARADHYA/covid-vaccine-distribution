import { useContext } from "react";
import { AccessTokenContext } from "../Contexts/AccessToken";

export const Home = ({ history }) => {
  const {
    accessToken,
    user: { isProfileAdded, isAdmin },
  } = useContext(AccessTokenContext);

  if (isAdmin) history.push("/admin");

  if (!accessToken) {
    history.push("/login");
    return null;
  } else if (isProfileAdded) {
    return <div>Success</div>;
  } else {
    history.push("/register_for_covid_vaccine");
    return null;
  }
};
