import { Redirect, Route, Switch } from "react-router-dom";
import { Home } from "./Home";
import { Login } from "./Login";
import { RegisterForVaccination } from "./RegisterForVaccination";
import { SignUp } from "./SignUp/";

const Routes = () => (
  <div
    style={{
      minHeight: "98vh",
      position: "relative",
    }}
  >
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <Route
        exact
        path="/register_for_covid_vaccine"
        component={RegisterForVaccination}
      />
      <Redirect to="/register_for_covid_vaccine" />
    </Switch>
  </div>
);

export default Routes;
