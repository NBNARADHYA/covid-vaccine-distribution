import { Redirect, Route, Switch } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp/";

const Routes = () => (
  <div
    style={{
      minHeight: "98vh",
      position: "relative",
    }}
  >
    <Switch>
      <Route path="/signup" component={SignUp} />
      <Route path="/login" component={Login} />
      <Redirect to="/login" />
    </Switch>
  </div>
);

export default Routes;
