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
  Stepper,
  Step,
  StepLabel,
  StepContent,
} from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Alert } from "@material-ui/lab";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ErrorAlert } from "../../common/ErrorAlert";
import { joinErrors } from "../../utils/joinErrors";
import { AccessTokenContext } from "../../../Contexts/AccessToken";
import { validate } from "./validate";
import DateFnsUtils from "@date-io/date-fns";
import { getAgeBand } from "./getAgeBand";
import { isTokenExpired, refreshToken } from "../../utils/refreshToken";
import { steps } from "./steps";

const useStyles = makeStyles((theme) => ({
  mainDiv: {
    paddingTop: "3vh",
    paddingBottom: "6vh",
  },
  formHeaderDiv: {
    textAlign: "center",
  },
  formHeader: {
    fontSize: "24px",
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
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
  const [formData, setFormData] = useState([{}, {}, {}]);

  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (accessToken) {
    if (isAdmin) {
      history.push("/admin/dashboard");
      return null;
    }
  } else history.push("/auth/login");

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
        <Typography variant="h3" color="primary" className={classes.formHeader}>
          Register for vaccination
        </Typography>
      </div>
      <Container>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel style={{ marginBottom: "2vh" }}>
                {step.label}
              </StepLabel>
              <StepContent>
                <Formik
                  initialValues={{ ...step.initialValues, ...formData[index] }}
                  validate={(values) => validate(values, index)}
                  onSubmit={async (values) => {
                    if (activeStep === steps.length - 1) {
                      setSubmitting(true);

                      if (
                        isTokenExpired(exp) &&
                        !(await refreshToken(setAccessToken))
                      )
                        history.push("/auth/login");

                      const { age, patientType, ...rest } = {
                        ...formData[0],
                        ...formData[1],
                        ...formData[2],
                        ...values,
                      };
                      try {
                        let res = await fetch(
                          `${process.env.REACT_APP_SERVER}/user/patient_profile`,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              authorization: `Bearer ${accessToken}`,
                            },
                            body: JSON.stringify({
                              ...rest,
                              ageBand: getAgeBand(age),
                              patientType: parseInt(patientType) + 1,
                            }),
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
                          setUser((prev) => ({
                            ...prev,
                            isProfileAdded: true,
                          }));
                          setSuccess(true);
                        }
                      } catch (error) {
                        setError(error);
                        setErrOpen(true);
                      } finally {
                        setSubmitting(false);
                      }
                    } else {
                      setActiveStep((prevActiveStep) => prevActiveStep + 1);
                      setFormData((prev) => {
                        const newVal = prev.map((prevObj) => ({ ...prevObj }));
                        newVal[index] = { ...values };
                        return newVal;
                      });
                    }
                  }}
                >
                  {({ values, handleChange, setFieldValue }) => (
                    <Form>
                      <Grid container direction="column" spacing={4}>
                        {step.fields.map((field, index) =>
                          field.name === "age" ? (
                            <Grid item xs={12} key={index}>
                              <Field
                                name="age"
                                as={TextField}
                                label="Age"
                                variant="outlined"
                              />
                              <ErrorMessage name="age" component={ErrorAlert} />
                            </Grid>
                          ) : field.name === "dateSymptoms" ? (
                            <Grid item xs={12} key={index}>
                              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDatePicker
                                  margin="normal"
                                  label="Date since covid symptoms"
                                  format="MM/dd/yyyy"
                                  value={values.dateSymptoms}
                                  onChange={(val) =>
                                    setFieldValue("dateSymptoms", val)
                                  }
                                />
                              </MuiPickersUtilsProvider>
                              <ErrorMessage
                                name="dateSymptoms"
                                component={ErrorAlert}
                              />
                            </Grid>
                          ) : (
                            <Grid item xs={12} key={index}>
                              <FormControl>
                                <FormLabel>{field.message}</FormLabel>
                                <RadioGroup
                                  name={field.name}
                                  value={
                                    values[field.name] === ""
                                      ? -1
                                      : +values[field.name]
                                  }
                                  onChange={handleChange(field.name)}
                                >
                                  {field.options.map((option, index) => (
                                    <FormControlLabel
                                      key={index}
                                      control={<Radio />}
                                      value={index}
                                      label={option}
                                    />
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <ErrorMessage
                                name={field.name}
                                component={ErrorAlert}
                              />
                            </Grid>
                          )
                        )}
                        <div className={classes.actionsContainer}>
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            className={classes.button}
                          >
                            Back
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={submitting}
                            className={classes.button}
                          >
                            {activeStep === steps.length - 1
                              ? "Register"
                              : "Next"}
                          </Button>
                        </div>
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </StepContent>
            </Step>
          ))}
        </Stepper>
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
