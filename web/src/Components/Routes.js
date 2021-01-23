import { Route, Switch } from "react-router-dom";
import { Admin } from "./admin";
import { Auth } from "./auth";
import { Header } from "./common/Header";
import { Home } from "./Home";
import { User } from "./user";

const Routes = () => (
  <div
    style={{
      minHeight: "98vh",
      position: "relative",
    }}
  >
    <Header />
    <Switch>
      <Route path="/auth" component={Auth} />
      <Route path="/admin" component={Admin} />
      <Route path="/user" component={User} />
      <Route path="/" component={Home} />
    </Switch>
  </div>
);

export default Routes;
