import {
  Card,
  Container,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
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
    accessToken,
  } = useContext(AccessTokenContext);
  const [registeredPatients, setRegisteredPatients] = useState({});
  const classes = useStyles();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER}/registered_patients`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const patients = {};
        res.patients.forEach((patient) => {
          const reg = patients[patient.vaccinationDate] || [];
          reg.push({ ...patient });
          patients[patient.vaccinationDate] = reg;
        });
        setRegisteredPatients({ ...patients });
      })
      .catch(console.error);
  }, [accessToken]);

  if (!isAdmin) history.push("/");

  return (
    <Container style={{ paddingTop: "10vh", textAlign: "center" }}>
      <Typography
        variant="h4"
        color="secondary"
        style={{ marginBottom: "2vh" }}
      >
        {Object.keys(registeredPatients).length === 0 &&
        registeredPatients.constructor === Object
          ? `No patient has been scheduled for vaccination`
          : `Currently scheduled patients for vaccination:`}
      </Typography>
      <Grid
        container
        direction="row"
        spacing={4}
        justify="center"
        alignItems="center"
      >
        {Object.entries(registeredPatients).map(([date, patients], idx) => (
          <Grid
            item
            container
            direction="column"
            xs={12}
            spacing={2}
            key={idx}
            justify="center"
            alignItems="center"
          >
            <Grid item>
              <Typography variant="subtitle1" color="textSecondary">
                <b>Date of vaccination:</b>&nbsp;{date}
              </Typography>
            </Grid>
            <Grid
              item
              container
              xs={12}
              direction="row"
              justify="center"
              alignItems="center"
              spacing={1}
            >
              {patients.map(
                ({ firstName, email, lastName, covidVulnerabilityScore }) => (
                  <Grid item xs={12} sm={6} lg={4}>
                    <Card>
                      <Grid item xs={12}>
                        <Typography variant="body1">
                          <b>Name</b>: {firstName + " " + lastName}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1">
                          <b>Email:</b> {email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1">
                          <b>Death rate:</b> {covidVulnerabilityScore}
                        </Typography>
                      </Grid>
                    </Card>
                  </Grid>
                )
              )}
            </Grid>
          </Grid>
        ))}
      </Grid>
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
