import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { VerifyEmail } from "./VerifyEmail";

export const Auth = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/login`} component={Login} />
      <Route path={`${path}/signup`} component={SignUp} />
      <Route path={`${path}/verify_email`} component={VerifyEmail} />
      <Redirect to="/" />
    </Switch>
  );
};
