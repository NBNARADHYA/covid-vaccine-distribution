import { React, useContext, useState } from "react";
import {
  makeStyles,
  Container,
  Snackbar,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Button,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Alert } from "@material-ui/lab";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ErrorAlert } from "../common/ErrorAlert";
import { joinErrors } from "../utils/joinErrors";
import { AccessTokenContext } from "../../Contexts/AccessToken";
import { validate } from "./validate";
import DateFnsUtils from "@date-io/date-fns";
import { getAgeBand } from "./getAgeBand";
import { isTokenExpired, refreshToken } from "../utils/refreshToken";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.between("sm", "lg")]: {
      width: "65%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "29%",
    },
  },
  mainDiv: {
    paddingTop: "15vh",
    paddingBottom: "6vh",
  },
  formHeaderDiv: {
    textAlign: "center",
    paddingBottom: "3vh",
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

export const RegisterForVaccination = ({ history }) => {
  const classes = useStyles();
  const [errOpen, setErrOpen] = useState(false);
  const [error, setError] = useState(null);
  const {
    accessToken,
    user: { isAdmin, isProfileAdded, exp },
    setAccessToken,
    setUser,
  } = useContext(AccessTokenContext);
  const [success, setSuccess] = useState(isProfileAdded);

  if (accessToken) {
    if (isAdmin) {
      history.push("/admin/dashboard");
      return null;
    }
  } else history.push("/login");

  if (success) {
    return (
      <Snackbar
        open={success}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={() => {
          setSuccess(false);
          history.push("/");
        }}
      >
        <Alert
          onClose={() => {
            setSuccess(false);
            history.push("/");
          }}
          severity="success"
        >
          Your details have been submitted successfully ! You will be notified
          once vaccination is scheduled for you !
        </Alert>
      </Snackbar>
    );
  }
  return (
    <div className={classes.mainDiv}>
      <div className={classes.formHeaderDiv}>
        <Typography
          variant="overline"
          color="primary"
          className={classes.formHeader}
        >
          Register for vaccination
        </Typography>
      </div>
      <Container className={classes.formContainer}>
        <Formik
          initialValues={{
            age: "",
            asthma: "",
            cardiovascular: "",
            contactOtherCovid: "",
            copd: "",
            dateSymptoms: new Date(),
            covidTestResult: "",
            diabetes: "",
            hypertension: "",
            icu: "",
            inmsupr: "",
            intubed: "",
            obesity: "",
            otherDisease: "",
            patientType: "",
            pneumonia: "",
            pregnancy: "",
            renalChronic: "",
            sex: "",
            tobacco: "",
          }}
          validate={validate}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            if (isTokenExpired(exp) && !(await refreshToken(setAccessToken)))
              history.push("/login");

            const { age, ...rest } = values;
            try {
              let res = await fetch(
                `${process.env.REACT_APP_SERVER}/add_patient_profile`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    authorization: `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({ ...rest, ageBand: getAgeBand(age) }),
                }
              );
              res = await res.json();
              if (res.errors) {
                setError(joinErrors(res.errors));
                setErrOpen(true);
              } else if (res.error) {
                setError(res.error);
                setErrOpen(true);
              } else {
                setUser((prev) => ({ ...prev, isProfileAdded: true }));
                setSuccess(true);
              }
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
              <Grid container direction="column" spacing={4}>
                <Grid item xs={12}>
                  <Field
                    name="age"
                    as={TextField}
                    label="Age"
                    variant="outlined"
                    fullWidth
                  />
                  <ErrorMessage name="age" component={ErrorAlert} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel>Are you male or female ?</FormLabel>
                    <RadioGroup
                      name="sex"
                      value={values.sex === "" ? -1 : +values.sex}
                      onChange={handleChange("sex")}
                    >
                      <FormControlLabel
                        control={<Radio />}
                        value={1}
                        label="Male"
                      />
                      <FormControlLabel
                        control={<Radio />}
                        value={0}
                        label="Female"
                      />
                    </RadioGroup>
                  </FormControl>
                  <ErrorMessage name="sex" component={ErrorAlert} />
                </Grid>
                {Object.entries({
                  icu: "Are you in ICU ?",
                  contactOtherCovid:
                    "Have you had contact with other covid positive folks ?",
                  intubed: "Are you currently intubed ?",
                  pneumonia: "Do you have pneumonia ?",
                  diabetes: "Do you have diabetes",
                  copd:
                    "Do you have COPD (Chronic obstructive pulmonary disease) ?",
                  asthma: "Do you have Asthma ?",
                  inmsupr: "Do you have Immunosuppression ?",
                  hypertension: "Do you have Hyper-tension ?",
                  cardiovascular: "Do you have any cardio vascular problems ?",
                  obesity: "Are you obese ?",
                  renalChronic: "Do you have Chronic kidney disease",
                  otherDisease: "Do you have any other disease ?",
                  pregnancy: "Are your pregnant ?",
                  tobacco: "Do you consume tobacco ?",
                }).map(([field, message], idx) => (
                  <Grid item xs={12} key={idx}>
                    <FormControl>
                      <FormLabel>{message}</FormLabel>
                      <RadioGroup
                        name={field}
                        value={values[field] === "" ? -1 : +values[field]}
                        onChange={handleChange(field)}
                      >
                        <FormControlLabel
                          control={<Radio />}
                          value={1}
                          label="Yes"
                        />
                        <FormControlLabel
                          control={<Radio />}
                          value={0}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                    <ErrorMessage name={field} component={ErrorAlert} />
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel>What is your covid test result ?</FormLabel>
                    <RadioGroup
                      name="covidTestResult"
                      value={
                        values.covidTestResult === ""
                          ? -1
                          : +values.covidTestResult
                      }
                      onChange={handleChange("covidTestResult")}
                    >
                      <FormControlLabel
                        control={<Radio />}
                        value={1}
                        label="Positive"
                      />
                      <FormControlLabel
                        control={<Radio />}
                        value={0}
                        label="Negative"
                      />
                      <FormControlLabel
                        control={<Radio />}
                        value={2}
                        label="Waiting for test results / not given test"
                      />
                    </RadioGroup>
                  </FormControl>
                  <ErrorMessage name="covidTestResult" component={ErrorAlert} />
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <FormLabel>
                      Are you an outpatient or an inpatient ?
                    </FormLabel>
                    <RadioGroup
                      name="patientType"
                      value={
                        values.patientType === "" ? -1 : +values.patientType
                      }
                      onChange={handleChange("patientType")}
                    >
                      <FormControlLabel
                        control={<Radio />}
                        value={1}
                        label="Outpatient"
                      />
                      <FormControlLabel
                        control={<Radio />}
                        value={2}
                        label="Inpatient"
                      />
                    </RadioGroup>
                  </FormControl>
                  <ErrorMessage name="patientType" component={ErrorAlert} />
                </Grid>
                <Grid item xs={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      margin="normal"
                      label="Date since covid symptoms"
                      format="MM/dd/yyyy"
                      value={values.dateSymptoms}
                      onChange={(val) => setFieldValue("dateSymptoms", val)}
                    />
                  </MuiPickersUtilsProvider>
                  <ErrorMessage name="dateSymptoms" component={ErrorAlert} />
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
    </div>
  );
};
