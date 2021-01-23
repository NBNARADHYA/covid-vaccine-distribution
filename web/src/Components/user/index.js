import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { RegisterForVaccination } from "./RegisterForVaccination";
import { UserDashBoard } from "./UserDashBoard";

export const User = () => {
  const { path } = useRouteMatch();

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
