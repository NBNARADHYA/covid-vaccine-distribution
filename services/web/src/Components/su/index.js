import React, { useContext } from "react";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { AccessTokenContext } from "../../Contexts/AccessToken";
import { SUDashBoard } from "./SUDashBoard";
import { ViewAdmin } from "./ViewAdmin";

export const SuperUser = () => {
  const { path } = useRouteMatch();
  const {
    accessToken,
    user: { isAdmin, isSuperUser },
  } = useContext(AccessTokenContext);

  if (!accessToken) return <Redirect to="/auth/login" />;

  if (!isSuperUser || isAdmin) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route exact path={`${path}/dashboard`} component={SUDashBoard} />
      <Route exact path={`${path}/admins/:adminEmail`} component={ViewAdmin} />
      <Redirect to="/admin/dashboard" />
    </Switch>
  );
};
