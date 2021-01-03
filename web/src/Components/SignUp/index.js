import {
  Container,
  Typography,
  makeStyles,
  Grid,
  TextField,
  Button,
  MenuItem,
  Snackbar,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { isEmail } from "../utils/isEmail";
import { states } from "./states";
import { ErrorAlert } from "../common/ErrorAlert";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { Alert } from "@material-ui/lab";
import { joinErrors } from "../utils/joinErrors";
import { AccessTokenContext } from "../../Contexts/AccessToken";
import jwtDecode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    textAlign: "center",
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
    fontSize: "35px",
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

const SignUp = ({ history }) => {
  const classes = useStyles();
  const [errOpen, setErrOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { accessToken } = useContext(AccessTokenContext);

  let isAdmin = false;

  if (accessToken) {
    const payload = jwtDecode(accessToken);
    console.log(payload);
    isAdmin = !!payload.isAdmin;
    if (!isAdmin) {
      history.push("/");
      return null;
    }
  }

  if (success)
    return (
      <Snackbar
        open={success}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(false);
          history.push(`/${isAdmin ? `login` : `signup`}`);
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
            history.push(`/${isAdmin ? `login` : `signup`}`);
          }}
          severity="success"
        >
          {`${isAdmin && `Admin`} Account created successfully! ${
            isAdmin
              ? `Ask the new admin to verify his/her email`
              : `Verify your email`
          } !`}
        </Alert>
      </Snackbar>
    );

  return (
    <Container className={classes.formContainer}>
      <Typography
        variant="overline"
        className={classes.formHeader}
        color="primary"
      >
        Signup
      </Typography>
      <Formik
        initialValues={{
          email: "",
          password: "",
          firstName: "",
          lastName: "",
          state: "",
        }}
        validate={({ email, password, firstName }) => {
          const errors = {};
          if (!email) {
            errors.email = "Email required";
          } else if (!isEmail(email)) errors.email = "Invalid Email";

          if (!firstName) errors.firstName = "First name required";

          if (!password) errors.password = "Password required";
          else if (password.length < 5)
            errors.password = "Password should be min. 5 characters long";

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          console.log(values);
          try {
            let res = await fetch(
              `${process.env.REACT_APP_SERVER}/${
                isAdmin ? `signup_admin` : `signup`
              }`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
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
        {({ isSubmitting, handleChange, values }) => (
          <Form>
            <Grid container direction="column" spacing={2}>
              <Grid item xs={12}>
                <Field
                  name="firstName"
                  as={TextField}
                  label="First Name"
                  variant="outlined"
                  fullWidth
                />
                <ErrorMessage name="firstName" component={ErrorAlert} />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="lastName"
                  as={TextField}
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="email"
                  as={TextField}
                  label="Email"
                  variant="outlined"
                  fullWidth
                />
                <ErrorMessage name="email" component={ErrorAlert} />
              </Grid>
              <Grid item xs={12}>
                <Field
                  name="password"
                  type="password"
                  as={TextField}
                  label="Password"
                  variant="outlined"
                  fullWidth
                />
                <ErrorMessage name="password" component={ErrorAlert} />
              </Grid>
              <Grid item container xs={12} justify="flex-start">
                <Grid item xs={6}>
                  <FormControlLabel
                    disabled
                    control={<Checkbox checked />}
                    label="Admin ?"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    label="Location"
                    value={values.state}
                    onChange={handleChange("state")}
                    fullWidth
                  >
                    {states.map((state, idx) => (
                      <MenuItem value={idx} key={idx}>
                        {state}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="overline"
                  color="textSecondary"
                  component={Link}
                  to="/login"
                >
                  Already signed up ?
                </Typography>
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
                  Sign Up
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

export default SignUp;
