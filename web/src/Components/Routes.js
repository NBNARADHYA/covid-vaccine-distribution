import { Redirect, Route, Switch } from "react-router-dom";
import { Admin } from "./admin";
import { Header } from "./common/Header";
import { Home } from "./Home";
import { Login } from "./Login";
import { RegisterForVaccination } from "./RegisterForVaccination";
import { SignUp } from "./SignUp/";
import { VerifyEmail } from "./VerifyEmail";

const Routes = () => (
  <div
    style={{
      minHeight: "98vh",
      position: "relative",
    }}
  >
    <Header />
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/signup" component={SignUp} />
      <Route exact path="/login" component={Login} />
      <Route
        exact
        path="/register_for_covid_vaccine"
        component={RegisterForVaccination}
      />
      <Route exact path="/verify_email" component={VerifyEmail} />
      <Route path="/admin" component={Admin} />
      <Redirect to="/register_for_covid_vaccine" />
    </Switch>
  </div>
);

export default Routes;
