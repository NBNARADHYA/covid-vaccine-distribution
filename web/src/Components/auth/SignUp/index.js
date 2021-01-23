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
import { isEmail } from "../../utils/isEmail";
import { states } from "./states";
import { ErrorAlert } from "../../common/ErrorAlert";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { Alert } from "@material-ui/lab";
import { joinErrors } from "../../utils/joinErrors";
import { AccessTokenContext } from "../../../Contexts/AccessToken";

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

export const SignUp = ({ history }) => {
  const classes = useStyles();
  const [errOpen, setErrOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const {
    accessToken,
    user: { isAdmin },
  } = useContext(AccessTokenContext);

  if (accessToken && !isAdmin) {
    history.push("/");
    return null;
  }

  if (success)
    return (
      <Snackbar
        open={success}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(false);
          history.push(`/${isAdmin ? `signup` : `login`}`);
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
            history.push(`/${isAdmin ? `signup` : `login`}`);
          }}
          severity="success"
        >
          {`${isAdmin ? `Admin` : ``} Account created successfully! ${
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
        validate={({ email, password, firstName, state }) => {
          const errors = {};
          if (!email) {
            errors.email = "Email required";
          } else if (!isEmail(email)) errors.email = "Invalid Email";

          if (!firstName) errors.firstName = "First name required";

          if (!password) errors.password = "Password required";
          else if (password.length < 5)
            errors.password = "Password should be min. 5 characters long";

          if (state === "") errors.state = "Location required";

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            let res = await fetch(
              `${process.env.REACT_APP_SERVER}/${
                isAdmin ? `su/signup_admin` : `auth/signup`
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
                {isAdmin && (
                  <Grid item xs={6}>
                    <FormControlLabel
                      disabled
                      control={<Checkbox checked />}
                      label="Admin ?"
                    />
                  </Grid>
                )}
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
                  to="/auth/login"
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
