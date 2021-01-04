import React, { useContext, useState } from "react";
import {
  makeStyles,
  Container,
  Typography,
  Grid,
  Button,
  Snackbar,
  TextField,
} from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ErrorAlert } from "../../common/ErrorAlert";
import { Alert } from "@material-ui/lab";
import { AccessTokenContext } from "../../../Contexts/AccessToken";
import { joinErrors } from "../../utils/joinErrors";
import { isDate } from "../../utils/isDate";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.between("sm", "lg")]: {
      width: "65%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "28%",
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

export const RegisterPatientsForVaccination = ({ history }) => {
  const classes = useStyles();
  const [errOpen, setErrOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const {
    accessToken,
    user: { isAdmin },
  } = useContext(AccessTokenContext);

  if (!accessToken || !isAdmin) history.push("/login");

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
          Vaccination registered for the most vulnerable patients according to
          the priority list!
        </Alert>
      </Snackbar>
    );

  return (
    <Container className={classes.formContainer}>
      <div className={classes.formHeaderDiv}>
        <Typography
          variant="overline"
          className={classes.formHeader}
          color="primary"
        >
          Enter vaccination details
        </Typography>
      </div>
      <Formik
        initialValues={{
          numVaccines: "",
          dateOfVaccination: new Date(),
        }}
        validate={({ numVaccines, dateOfVaccination }) => {
          const errors = {};

          if (numVaccines === undefined || numVaccines === null) {
            errors.numVaccines = "numVaccines required";
          } else if (isNaN(numVaccines))
            errors.numVaccines = "Invalid numVaccines";

          if (!dateOfVaccination) {
            errors.dateOfVaccination = "dateOfVaccination required";
          } else if (
            !isDate(new Date(dateOfVaccination)) ||
            new Date(dateOfVaccination).getTime() <= Date.now()
          )
            errors.dateOfVaccination = "Invalid dateOfVaccination";

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            let res = await fetch(
              `${process.env.REACT_APP_SERVER}/register_vaccination`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(values),
              }
            );
            res = await res.json();
            if (res.errors) {
              setError(joinErrors(res.errors));
              setErrOpen(true);
            } else setSuccess(true);
          } catch (error) {
            setError(error);
            setErrOpen(true);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <Grid container direction="column" spacing={3}>
              <Grid item xs={12}>
                <Field
                  name="numVaccines"
                  as={TextField}
                  label="Number of vaccines available"
                  variant="outlined"
                  fullWidth
                />
                <ErrorMessage name="numVaccines" component={ErrorAlert} />
              </Grid>
              <Grid item xs={12}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    margin="normal"
                    label="Date of vaccination"
                    format="MM/dd/yyyy"
                    value={values.dateOfVaccination}
                    onChange={(val) => setFieldValue("dateOfVaccination", val)}
                  />
                </MuiPickersUtilsProvider>
                <ErrorMessage name="dateOfVaccination" component={ErrorAlert} />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  size="large"
                  variant="contained"
                  color="primary"
                  className={classes.submitBtn}
                  disabled={isSubmitting}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
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
