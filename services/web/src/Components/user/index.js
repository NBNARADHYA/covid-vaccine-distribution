import { useContext } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { AccessTokenContext } from "../../Contexts/AccessToken";
import { RegisterForVaccination } from "./RegisterForVaccination";
import { UserDashBoard } from "./UserDashBoard";

export const User = () => {
  const { path } = useRouteMatch();
  const {
    accessToken,
    user: { isAdmin, isSuperUser },
  } = useContext(AccessTokenContext);

  if (!accessToken) return <Redirect to="/auth/login" />;

  if (isAdmin || isSuperUser) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route path={`${path}/dashboard`} component={UserDashBoard} />
      <Route
        path={`${path}/register_for_covid_vaccine`}
        component={RegisterForVaccination}
      />
      <Redirect to="/user/dashboard" />
    </Switch>
  );
};
