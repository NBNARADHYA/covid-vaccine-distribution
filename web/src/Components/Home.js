import { useContext } from "react";
import { AccessTokenContext } from "../Contexts/AccessToken";

export const Home = ({ history }) => {
  const {
    accessToken,
    user: { isRegisteredForVaccination, isAdmin },
  } = useContext(AccessTokenContext);

  if (isAdmin) history.push("/admin");

  if (!accessToken) {
    history.push("/login");
    return null;
  } else if (isRegisteredForVaccination) {
    return <div>Success</div>;
  } else {
    history.push("/register_for_covid_vaccine");
    return null;
  }
};
