import {
  Container,
  Typography,
  makeStyles,
  Grid,
  TextField,
  Button,
  Snackbar,
  Input,
} from "@material-ui/core";
import { Form, Formik, Field, ErrorMessage } from "formik";
import { isEmail } from "../../utils/isEmail";
import { ErrorAlert } from "../../common/ErrorAlert";
import { Link } from "react-router-dom";
import { useCallback, useContext, useState } from "react";
import { Alert } from "@material-ui/lab";
import { joinErrors } from "../../utils/joinErrors";
import { AccessTokenContext } from "../../../Contexts/AccessToken";
import useAlgoliaPlaces from "../../hooks/useAlgoliPlaces";

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
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [location, setLocation] = useState("");
  const { accessToken } = useContext(AccessTokenContext);

  const setContainer = useAlgoliaPlaces({
    options: {
      appId: process.env.REACT_APP_ALGOLIA_APP_ID,
      apiKey: process.env.REACT_APP_ALGOLIA_API_KEY,
    },
    events: {
      onChange({ suggestion }) {
        const {
          name,
          administrative,
          country,
          latlng: { lat, lng },
        } = suggestion;
        setLat(lat);
        setLng(lng);
        setLocation(`${name}, ${administrative}, ${country}`);
      },
    },
  });

  const algoliaPlacesRef = useCallback((node) => {
    if (node !== null) {
      setContainer(node);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (accessToken) {
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
          history.push(`/login`);
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
            history.push(`/login`);
          }}
          severity="success"
        >
          {`Account created successfully! Verify your email !`}
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
          location: "",
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

          if (
            lat === null ||
            lat === undefined ||
            lng === null ||
            lng === undefined
          )
            errors.location = "Location required";
          else if (isNaN(lat) || isNaN(lng))
            errors.location = "Invalid location";

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          try {
            let res = await fetch(
              `${process.env.REACT_APP_SERVER}/auth/signup`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...values, lat, lng }),
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
        {({ isSubmitting, handleChange, values, setFieldValue }) => (
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
              <Grid item xs={12}>
                <Input
                  placeholder="Location"
                  label="Location"
                  value={location}
                  inputRef={algoliaPlacesRef}
                  fullWidth
                  variant="contained"
                  onChange={(e) => setLocation(e.target.value)}
                />
                <ErrorMessage name="location" component={ErrorAlert} />
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
