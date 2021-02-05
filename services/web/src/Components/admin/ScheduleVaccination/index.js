import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  makeStyles,
  Container,
  Typography,
  Grid,
  Button,
  Snackbar,
  TextField,
  CircularProgress,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ErrorAlert } from "../../common/ErrorAlert";
import { Alert } from "@material-ui/lab";
import { AccessTokenContext } from "../../../Contexts/AccessToken";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "65%",
    },
    paddingTop: "15vh",
    paddingBottom: "6vh",
  },
  formHeader: {
    fontSize: "15px",
  },
  formHeaderDiv: {
    paddingBottom: "4vh",
  },
  card: {
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingLeft: "15px",
  },
  form: {
    padding: "20px",
    width: "300px",
    height: "120px",
  },
}));

export const SchedulePatientsForVaccination = ({ history }) => {
  const classes = useStyles();
  const [errOpen, setErrOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [nonScheduledPatients, setNonScheduledPatients] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    accessToken,
    user: { isAdmin },
  } = useContext(AccessTokenContext);

  const handleDialogClose = useCallback(() => setDialogOpen(false), []);

  if (!accessToken || !isAdmin) history.push("/auth/login");

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_SERVER}/admin/non_scheduled_patients`, {
      method: "GET",
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
        setNonScheduledPatients(patients);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [accessToken]);

  if (loading) {
    return <CircularProgress />;
  }

  if (success)
    return (
      <Snackbar
        open={success}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(false);
          history.push(`/`);
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
            history.push("/");
          }}
          severity="success"
        >
          <Typography variant="h6" style={{ marginBottom: "2vh" }}>
            The following patients have be scheduled time slots for vaccination
          </Typography>
          <Grid
            container
            direction="row"
            spacing={4}
            justify="center"
            alignItems="center"
          >
            {Object.entries(success).map(([date, patients], idx) => (
              <Grid
                item
                container
                direction="row"
                xs={12}
                spacing={2}
                key={idx}
              >
                <Grid item>
                  <Typography variant="subtitle1" color="primary">
                    <b>Date of vaccination</b>&nbsp;{date}
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
                  {patients.map(({ email, vaccinationTimeSlot }) => (
                    <Grid item xs={12}>
                      <Card className={classes.card}>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <b style={{ marginRight: "7px" }}>Email</b>
                            <a
                              style={{
                                textDecoration: "none",
                                color: "grey",
                              }}
                              href={`mailto:${email}`}
                            >
                              {email}
                            </a>
                          </Typography>
                        </Grid>
                        {vaccinationTimeSlot && (
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              <b style={{ marginRight: "7px" }}>Time slot</b>
                              {vaccinationTimeSlot}
                            </Typography>
                          </Grid>
                        )}
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Alert>
      </Snackbar>
    );

  if (!Object.keys(nonScheduledPatients).length) {
    return (
      <Container style={{ paddingTop: "15vh", textAlign: "center" }}>
        <Typography variant="h4" color="primary">
          All patients have been scheduled time slots !
        </Typography>
      </Container>
    );
  }

  return (
    <Container className={classes.formContainer}>
      <div style={{ marginBottom: "3vh" }}>
        <Typography
          variant="h5"
          color="secondary"
          style={{ marginBottom: "5vh", textAlign: "center" }}
        >
          <span style={{ marginRight: "30px" }}>
            The following patients have to be scheduled time slots
          </span>
          <span>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setDialogOpen(true)}
            >
              Schedule Time slots
            </Button>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
              <DialogTitle>Schedule vaccination time slots</DialogTitle>
              <Formik
                initialValues={{
                  patientsPerSlot: "",
                }}
                validate={({ patientsPerSlot }) => {
                  const errors = {};

                  if (!patientsPerSlot) {
                    errors.patientsPerSlot = "patientsPerSlot required";
                  } else if (isNaN(patientsPerSlot) || patientsPerSlot <= 0)
                    errors.patientsPerSlot = "Invalid patientsPerSlot";

                  return errors;
                }}
                onSubmit={async ({ patientsPerSlot }, { setSubmitting }) => {
                  setSubmitting(true);
                  try {
                    let res = await fetch(
                      `${process.env.REACT_APP_SERVER}/admin/schedule_vaccination`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify({
                          patientsPerSlot: parseInt(patientsPerSlot),
                        }),
                      }
                    );
                    res = await res.json();
                    if (res.error) {
                      setError(res.error);
                      setErrOpen(true);
                    } else {
                      const patients = {};
                      res.scheduledPatients.forEach((patient) => {
                        const reg = patients[patient.vaccinationDate] || [];
                        reg.push({ ...patient });
                        patients[patient.vaccinationDate] = reg;
                      });
                      setSuccess(patients);
                    }
                  } catch (error) {
                    setError(error);
                    setErrOpen(true);
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <DialogContent>
                      <DialogContentText>
                        To schedule time slots for patients for whom vaccines
                        have been dispatched by the vaccination production
                        center, please enter the average number patients who are
                        vaccinated in your center in a hour long time slot.
                      </DialogContentText>
                      <Field
                        name="patientsPerSlot"
                        as={TextField}
                        label="Vaccination rate"
                        variant="outlined"
                        fullWidth
                        autoFocus
                        margin="dense"
                      />
                      <ErrorMessage
                        name="patientsPerSlot"
                        component={ErrorAlert}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleDialogClose} color="primary">
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        Schedule
                      </Button>
                    </DialogActions>
                  </Form>
                )}
              </Formik>
            </Dialog>
          </span>
        </Typography>
        <Grid
          container
          direction="row"
          spacing={4}
          justify="center"
          alignItems="center"
        >
          {Object.entries(nonScheduledPatients).map(([date, patients], idx) => (
            <Grid item container direction="row" xs={12} spacing={2} key={idx}>
              <Grid item>
                <Typography variant="subtitle1" color="primary">
                  <b>Date of vaccine delivery</b>&nbsp;{date}
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
                  ({
                    firstName,
                    email,
                    lastName,
                    covidVulnerabilityScore,
                    vaccinationTimeSlot,
                    location: { coordinates },
                  }) => (
                    <Grid item xs={12}>
                      <Card className={classes.card}>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <b style={{ marginRight: "7px" }}>Name</b>
                            {firstName + " " + lastName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <b style={{ marginRight: "7px" }}>Location</b>
                            {`${coordinates[0]} lat, ${coordinates[1]} lng`}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <b style={{ marginRight: "7px" }}>Email</b>
                            <a
                              style={{
                                textDecoration: "none",
                                color: "grey",
                              }}
                              href={`mailto:${email}`}
                            >
                              {email}
                            </a>
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body1">
                            <b style={{ marginRight: "7px" }}>Score</b>
                            {covidVulnerabilityScore}
                          </Typography>
                        </Grid>
                        {vaccinationTimeSlot && (
                          <Grid item xs={12}>
                            <Typography variant="body1">
                              <b style={{ marginRight: "7px" }}>Time slot</b>
                              {vaccinationTimeSlot}
                            </Typography>
                          </Grid>
                        )}
                      </Card>
                    </Grid>
                  )
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </div>
      <Snackbar
        open={errOpen}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={() => setErrOpen(false)}
      >
        <Alert onClose={() => setErrOpen(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};
