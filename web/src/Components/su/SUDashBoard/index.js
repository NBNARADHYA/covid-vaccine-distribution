import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AccessTokenContext } from "../../../Contexts/AccessToken";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Bar } from "react-chartjs-2";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ErrorAlert } from "../../common/ErrorAlert";
import { Alert } from "@material-ui/lab";
import { isTokenExpired, refreshToken } from "../../utils/refreshToken";

export const SUDashBoard = ({ history }) => {
  const {
    user: {
      firstName,
      lastName,
      email,
      location: { coordinates },
      exp,
    },
    accessToken,
    setAccessToken,
  } = useContext(AccessTokenContext);

  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: coordinates[0],
    longitude: coordinates[1],
    zoom: 5,
  });
  const [patients, setPatients] = useState([]);
  const [lastNumDays, setLastNumDays] = useState(30);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errOpen, setErrOpen] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER}/admins`)
      .then((res) => res.json())
      .then((res) => {
        setAdmins(res.admins);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let url = `${process.env.REACT_APP_SERVER}/patient_trend`;
    if (lastNumDays) {
      url += `?lastNumDays=${lastNumDays}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((res) => setPatients(res.patients))
      .catch(console.error);
  }, [lastNumDays]);

  const patientTrendDates = useMemo(() => {
    const map = {},
      dates = [];
    patients.forEach((patient) => {
      if (!map[patient.vaccinationDate]) dates.push(patient.vaccinationDate);
    });
    return dates;
  }, [patients]);

  const handleDialogClose = useCallback(() => setDialogOpen(false), []);

  return (
    <Container style={{ paddingTop: "3vh" }}>
      <Typography variant="h4" color="primary" style={{ marginBottom: "3vh" }}>
        <span style={{ marginRight: "30px" }}>
          Vaccination Production Center Details
        </span>
        <span>
          <span style={{ fontSize: "15px", color: "#00b33c" }}>
            New batch of vaccines produced ?
          </span>
          &nbsp;
          <Button variant="contained" onClick={() => setDialogOpen(true)}>
            Dispatch vaccines
          </Button>
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Register and Dispatch</DialogTitle>
            <Formik
              initialValues={{ numVaccines: "" }}
              validate={({ numVaccines }) => {
                if (
                  numVaccines === undefined ||
                  numVaccines === "" ||
                  numVaccines === null
                ) {
                  return { numVaccines: "Number of vaccines required" };
                }
                if (isNaN(numVaccines))
                  return { numVaccines: "Invalid field number of vaccines" };
                return {};
              }}
              onSubmit={async (values, { setSubmitting }) => {
                setSubmitting(true);
                if (
                  isTokenExpired(exp) &&
                  !(await refreshToken(setAccessToken))
                )
                  history.push("/auth/login");
                try {
                  let res = await fetch(
                    `${process.env.REACT_APP_SERVER}/su/register_and_dispatch_vaccines`,
                    {
                      method: "POST",
                      headers: {
                        authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ ...values }),
                    }
                  );
                  res = await res.json();
                  if (res.error) {
                    setError(res.error);
                    setErrOpen(true);
                  } else {
                    setSuccess(true);
                  }
                } catch (error) {
                  setError(error);
                  setErrOpen(true);
                } finally {
                  setSubmitting(false);
                  setDialogOpen(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <DialogContent>
                    <DialogContentText>
                      To dispatch vaccines to most needy patients, please enter
                      the number of vaccines produced in the batch. Vaccination
                      centre admins can schedule time slots for those patients
                      later.
                    </DialogContentText>
                    <Field
                      name="numVaccines"
                      as={TextField}
                      label="Number of vaccines in the batch"
                      variant="outlined"
                      fullWidth
                      autoFocus
                      margin="dense"
                    />
                    <ErrorMessage name="numVaccines" component={ErrorAlert} />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                      Cancel
                    </Button>
                    <Button
                      disabled={isSubmitting}
                      type="submit"
                      color="primary"
                    >
                      Register and Dispatch
                    </Button>
                  </DialogActions>
                  <Snackbar
                    open={success}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    autoHideDuration={6000}
                    onClose={() => setSuccess(false)}
                  >
                    <Alert onClose={() => setSuccess(false)} severity="success">
                      Your details have been submitted successfully ! You will
                      be notified once vaccination is scheduled for you !
                    </Alert>
                  </Snackbar>
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
                </Form>
              )}
            </Formik>
          </Dialog>
        </span>
      </Typography>
      <div>
        <Typography
          variant="h5"
          color="secondary"
          style={{ marginBottom: "3vh" }}
        >
          <span style={{ marginRight: "30px" }}>
            Patient Trend throughout India
          </span>
          <span style={{ fontSize: "16px", color: "#5c5c8a" }}>
            Last&nbsp;
            <TextField
              variant="outlined"
              value={lastNumDays}
              size="small"
              onChange={(e) => setLastNumDays(e.target.value)}
              className="last-num-days"
            />
            &nbsp;Days
          </span>
        </Typography>
        {patientTrendDates.length && (
          <Bar
            data={{
              labels: patientTrendDates,
              datasets: [
                {
                  label: "#patients vaccinated",
                  data: patients.map((patient) =>
                    patient.isVaccinated ? patient.count : 0
                  ),
                  borderColor: "#00e600",
                  backgroundColor: "#b3ffb3",
                },
                {
                  label: "#patients scheduled for vaccination",
                  data: patients.map((patient) =>
                    !patient.isVaccinated ? patient.count : 0
                  ),
                  borderColor: "#ff4d4d",
                  backgroundColor: "#ffb3b3",
                },
              ],
            }}
            options={{
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
            }}
          />
        )}
      </div>
      <div style={{ marginBottom: "5vh" }}>
        <div style={{ marginBottom: "2vh" }}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ marginBottom: "1vh" }}
          >
            Super user's Name
          </Typography>
          <Typography variant="body1">{firstName + " " + lastName}</Typography>
        </div>
        <div style={{ marginBottom: "2vh" }}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ marginBottom: "1vh" }}
          >
            Super user's Email
          </Typography>
          <Typography variant="body1">{email}</Typography>
        </div>
      </div>
      <div style={{ marginBottom: " 3vh" }}>
        <Typography
          variant="h5"
          color="secondary"
          style={{ marginBottom: "1vh" }}
        >
          Vaccination centres throughout India
        </Typography>
        <ReactMapGL
          {...viewport}
          onViewportChange={(viewport) => setViewport(viewport)}
          height="70vh"
          width="70vw"
          mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
          mapStyle={process.env.REACT_APP_MAP_STYLE_URL}
        >
          {admins.map(
            ({ firstName, lastName, email, location: { coordinates } }) => (
              <Marker
                latitude={coordinates[0]}
                longitude={coordinates[1]}
                key={email}
              >
                <button
                  className="marker-btn"
                  onClick={() =>
                    setSelectedAdmin({
                      firstName,
                      lastName,
                      email,
                      coordinates,
                    })
                  }
                >
                  <img
                    src="/vaccinationIcon.webp"
                    alt={firstName + " " + lastName}
                  />
                </button>
              </Marker>
            )
          )}
          {selectedAdmin && (
            <Popup
              latitude={selectedAdmin.coordinates[0]}
              longitude={selectedAdmin.coordinates[1]}
              onClose={() => setSelectedAdmin(null)}
            >
              <div className="popup">
                <Typography variant="body1">
                  <b style={{ marginRight: "7px" }}>Admin Name</b>
                  {selectedAdmin.firstName + " " + selectedAdmin.lastName}
                </Typography>
                <Typography variant="body1">
                  <b style={{ marginRight: "7px" }}>Email</b>
                  <a
                    style={{
                      textDecoration: "none",
                      color: "grey",
                    }}
                    href={`mailto:${selectedAdmin.email}`}
                  >
                    {email}
                  </a>
                </Typography>
              </div>
            </Popup>
          )}
        </ReactMapGL>
      </div>
    </Container>
  );
};
