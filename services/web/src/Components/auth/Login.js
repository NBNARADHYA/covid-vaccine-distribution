import {
  Container,
  Typography,
  makeStyles,
  Grid,
  TextField,
  Button,
  Snackbar,
} from "@material-ui/core";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { isEmail } from "../utils/isEmail";
import { ErrorAlert } from "../common/ErrorAlert";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Alert } from "@material-ui/lab";
import { joinErrors } from "../utils/joinErrors";
import { AccessTokenContext } from "../../Contexts/AccessToken";
import { useContext } from "react";

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

export const Login = ({ history }) => {
  const classes = useStyles();
  const [errOpen, setErrOpen] = useState(false);
  const [error, setError] = useState(null);

  const { setAccessToken, accessToken } = useContext(AccessTokenContext);

  if (accessToken) {
    history.push("/");
    return null;
  }

  return (
    <Container className={classes.formContainer}>
      <Typography
        variant="overline"
        className={classes.formHeader}
        color="primary"
      >
        Login
      </Typography>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validate={({ email, password }) => {
          const errors = {};
          if (!email) {
            errors.email = "Email required";
          } else if (!isEmail(email)) errors.email = "Invalid Email";

          if (!password) errors.password = "Password required";
          else if (password.length < 5)
            errors.password = "Password should be min. 5 characters long";

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            let res = await fetch(
              `${process.env.REACT_APP_SERVER}/auth/login`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
                credentials: "include",
              }
            );
            res = await res.json();
            if (res.errors) {
              setError(joinErrors(res.errors));
              setErrOpen(true);
            } else if (!res.accessToken) {
              setError("Something went wrong ! Please try again later!");
              setErrOpen(true);
            } else {
              setAccessToken(res.accessToken);
              history.push("/");
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
            <Grid container direction="column" spacing={2}>
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
              <Grid item xs={12}>
                <Typography
                  variant="overline"
                  color="textSecondary"
                  component={Link}
                  to="/auth/signup"
                >
                  Not signed up ?
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
                  Login
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
