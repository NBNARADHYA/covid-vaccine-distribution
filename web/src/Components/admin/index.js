import React from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { SchedulePatientsForVaccination } from "./ScheduleVaccination";
import { AdminDashBoard } from "./AdminDashBoard";

export const Admin = () => {
  const { path } = useRouteMatch();
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
