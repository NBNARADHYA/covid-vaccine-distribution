import { Button, Container, makeStyles } from "@material-ui/core";
import { useContext } from "react";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { AccessTokenContext } from "../../Contexts/AccessToken";
import { RegisterPatientsForVaccination } from "./registerVaccination";

const useStyles = makeStyles((theme) => ({
  submitBtn: {
    [theme.breakpoints.down("lg")]: {
      width: "50%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "40%",
    },
    fontSize: "17px",
  },
}));

export const Admin = ({ history }) => {
  const { path, url } = useRouteMatch();
  const {
    user: { isAdmin },
  } = useContext(AccessTokenContext);
  const classes = useStyles();

  if (!isAdmin) history.push("/");

  return (
    <Container style={{ paddingTop: "10vh" }}>
      <Switch>
        <Route
          exact
          path={`${path}/register_patients_for_vaccination`}
          component={RegisterPatientsForVaccination}
        />
      </Switch>
    </Container>
  );
};
