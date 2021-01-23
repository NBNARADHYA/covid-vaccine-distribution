import React, { useContext } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { SchedulePatientsForVaccination } from "./ScheduleVaccination";
import { AdminDashBoard } from "./AdminDashBoard";
import { AccessTokenContext } from "../../Contexts/AccessToken";

export const Admin = () => {
  const { path } = useRouteMatch();
  const {
    accessToken,
    user: { isAdmin, isSuperUser },
  } = useContext(AccessTokenContext);

  if (!accessToken) return <Redirect to="/auth/login" />;

  if (!isAdmin || isSuperUser) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route exact path={`${path}/dashboard`} component={AdminDashBoard} />
      <Route
        exact
        path={`${path}/schedule_patients_for_vaccination`}
        component={SchedulePatientsForVaccination}
      />
      <Redirect to="/admin/dashboard" />
    </Switch>
  );
};
