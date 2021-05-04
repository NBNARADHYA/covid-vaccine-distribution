import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  Container,
  Grid,
  makeStyles,
  Typography,
  Button,
  TextField,
} from "@material-ui/core";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Bar } from "react-chartjs-2";
import { useContext, useEffect, useState } from "react";
import { AccessTokenContext } from "../../../Contexts/AccessToken";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { vaccinationStateDetails } from "./vaccinationStateDetails";
import { logout } from "../../utils/logout";
import { refreshToken } from "../../utils/refreshToken";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

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
  accordionHeading: {
    fontSize: theme.typography.pxToRem(18),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  accordionSecondaryHeading: {
    fontSize: theme.typography.pxToRem(18),
    color: theme.palette.text.secondary,
  },
  card: {
    padding: "5px",
  },
}));

export const AdminDashBoard = ({ history }) => {
  const {
    user: {
      firstName,
      lastName,
      email,
      location: { coordinates },
    },
    accessToken,
    setAccessToken,
  } = useContext(AccessTokenContext);
  const [registeredPatients, setRegisteredPatients] = useState({
    scheduled: {},
    notScheduled: {},
    vaccinated: {},
  });
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const [lastNumDays, setLastNumDays] = useState(30);
  const [nextNumDays, setNextNumDays] = useState(30);

  const [viewport, setViewport] = useState({
    latitude: coordinates[0],
    longitude: coordinates[1],
    zoom: 6,
  });

  const [selectedPatient, setSelectedPatient] = useState(null);

  const handleActionsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionsSelect = () => {
    setAnchorEl(null);
    history.push("/admin/schedule_patients_for_vaccination");
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (state) => (_, isExpanded) => {
    setExpanded(isExpanded ? state : false);
  };

  useEffect(() => {
    let url = `${process.env.REACT_APP_SERVER}/admin/registered_patients?`;

    if (lastNumDays) {
      url += `lastNumDays=${lastNumDays}&`;
    }
    if (nextNumDays) {
      url += `nextNumDays=${nextNumDays}`;
    }

    fetch(url, {
      method: "GET",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.error && (await refreshToken(setAccessToken))) {
          return await logout(setAccessToken);
        }
        const newRegisteredPatients = {};
        ["scheduled", "notScheduled", "vaccinated"].forEach((state) => {
          const patients = {};
          res.patients[state].forEach((patient) => {
            const reg = patients[patient.vaccinationDate] || [];
            reg.push({ ...patient });
            patients[patient.vaccinationDate] = reg;
          });
          newRegisteredPatients[state] = patients;
        });
        setRegisteredPatients(newRegisteredPatients);
      })
      .catch(async () => await logout(setAccessToken));
  }, [accessToken, history, setAccessToken, lastNumDays, nextNumDays]);

  const scheduledOrVaccinatedPatients = {
    ...registeredPatients["scheduled"],
    ...registeredPatients["vaccinated"],
  };

  return (
    <Container style={{ paddingTop: "3vh" }}>
      <Typography variant="h4" color="primary" style={{ marginBottom: "3vh" }}>
        <span style={{ marginRight: "30px" }}>Admin Dashboard</span>
        <span>
          <Button variant="contained" onClick={handleActionsClick}>
            Admin Actions
          </Button>
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleActionsClose}
          >
            <MenuItem onClick={handleActionsSelect}>
              Schedule Patients for vaccination
            </MenuItem>
          </Menu>
        </span>
      </Typography>
      {Boolean(Object.keys(scheduledOrVaccinatedPatients).length) && (
        <div style={{ marginBottom: "3vh" }}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ marginBottom: "3vh" }}
          >
            <span style={{ marginRight: "30px" }}>
              Patient Trend of your center
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
            <span
              style={{ fontSize: "16px", color: "#808000", marginLeft: "40px" }}
            >
              Next&nbsp;
              <TextField
                variant="outlined"
                value={nextNumDays}
                size="small"
                onChange={(e) => setNextNumDays(e.target.value)}
                className="last-num-days"
              />
              &nbsp;Days
            </span>
          </Typography>
          <Bar
            data={{
              labels: Object.keys(scheduledOrVaccinatedPatients).map(
                (day) => day
              ),
              datasets: [
                {
                  label: "#patients vaccinated",
                  data: Object.keys(scheduledOrVaccinatedPatients).map(
                    (day) => registeredPatients["vaccinated"][day]?.length || 0
                  ),
                  borderColor: "#00e600",
                  backgroundColor: "#66ff66",
                },
                {
                  label: "#patients scheduled for vaccination",
                  data: Object.keys(registeredPatients["scheduled"]).map(
                    (day) => registeredPatients["scheduled"][day]?.length | 0
                  ),
                  borderColor: "#ff4d4d",
                  backgroundColor: "#ff6666",
                },
              ],
            }}
            options={{
              scales: {
                yAxes: [
                  {
                    ticks: {
                      fontSize: 18,
                      beginAtZero: true,
                    },
                    gridLines: {
                      color: "#669999",
                    },
                  },
                ],
                xAxes: [
                  {
                    ticks: {
                      fontSize: 14,
                    },
                    gridLines: {
                      color: "#669999",
                    },
                  },
                ],
              },
            }}
          />
        </div>
      )}
      <div style={{ marginBottom: "5vh" }}>
        <Typography
          variant="h5"
          color="secondary"
          style={{ marginBottom: "3vh" }}
        >
          <span style={{ marginRight: "30px" }}>Patient Details</span>
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
          <span
            style={{ fontSize: "16px", color: "#808000", marginLeft: "40px" }}
          >
            Next&nbsp;
            <TextField
              variant="outlined"
              value={nextNumDays}
              size="small"
              onChange={(e) => setNextNumDays(e.target.value)}
              className="last-num-days"
            />
            &nbsp;Days
          </span>
        </Typography>
        {["scheduled", "notScheduled", "vaccinated"].map((state) => (
          <Accordion
            key={state}
            expanded={expanded === state}
            onChange={handleChange(state)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.accordionHeading}>
                {vaccinationStateDetails[state].name}
              </Typography>
              <Typography className={classes.accordionSecondaryHeading}>
                {vaccinationStateDetails[state].description}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                container
                direction="row"
                spacing={4}
                justify="center"
                alignItems="center"
              >
                {state === "notScheduled" &&
                  Boolean(Object.keys(registeredPatients[state]).length) && (
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() =>
                          history.push(
                            "/admin/schedule_patients_for_vaccination"
                          )
                        }
                      >
                        Schedule time slots for these patients
                      </Button>
                    </Grid>
                  )}
                {Object.entries(registeredPatients[state]).map(
                  ([date, patients]) => (
                    <Grid
                      item
                      container
                      direction="row"
                      xs={12}
                      spacing={2}
                      key={`${Math.random() * 10000}${date}${state}`}
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
                          ({
                            firstName,
                            email,
                            lastName,
                            covidVulnerabilityScore,
                            vaccinationTimeSlot,
                            location: { coordinates },
                          }) => (
                            <Grid item xs={12} key={email}>
                              <Card className={classes.card}>
                                <Grid item xs={12}>
                                  <Typography variant="body1">
                                    <b style={{ marginRight: "7px" }}>Name</b>
                                    {firstName + " " + lastName}
                                  </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                  <Typography variant="body1">
                                    <b style={{ marginRight: "7px" }}>
                                      Location
                                    </b>
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
                                      <b style={{ marginRight: "7px" }}>
                                        Time slot
                                      </b>
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
                  )
                )}
                {Object.keys(registeredPatients[state]).length === 0 && (
                  <Typography className={classes.accordionHeading}>
                    No {vaccinationStateDetails[state].name}
                  </Typography>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      <div style={{ marginBottom: "5vh" }}>
        <div style={{ marginBottom: "2vh" }}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ marginBottom: "1vh" }}
          >
            Admin's Name
          </Typography>
          <Typography variant="body1">{firstName + " " + lastName}</Typography>
        </div>
        <div style={{ marginBottom: "2vh" }}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ marginBottom: "1vh" }}
          >
            Admin's Email
          </Typography>
          <Typography variant="body1">{email}</Typography>
        </div>
      </div>
      <div style={{ paddingBottom: " 3vh" }}>
        <Typography
          variant="h5"
          color="secondary"
          style={{ marginBottom: "2vh" }}
        >
          Location
        </Typography>
        <ReactMapGL
          {...viewport}
          onViewportChange={(viewport) => setViewport(viewport)}
          height="70vh"
          width="70vw"
          mapboxApiAccessToken={process.env.REACT_APP_MAP_TOKEN}
          mapStyle={process.env.REACT_APP_MAP_STYLE_URL}
        >
          <Marker latitude={coordinates[0]} longitude={coordinates[1]}>
            <button className="marker-btn">
              <img src="/vaccinationIcon.webp" alt="Vaccination center" />
            </button>
          </Marker>
          {Object.entries(scheduledOrVaccinatedPatients).map(
            ([_date, patients], idx) => (
              <React.Fragment key={idx}>
                {patients.map((patient) => {
                  const {
                    firstName,
                    lastName,
                    location: { coordinates },
                    email,
                    isVaccinated,
                  } = patient;
                  return (
                    <Marker
                      latitude={coordinates[0]}
                      longitude={coordinates[1]}
                      key={email}
                    >
                      <button
                        className="marker-btn"
                        onClick={() => setSelectedPatient({ ...patient })}
                      >
                        <img
                          src={
                            isVaccinated
                              ? `/greenPatientIcon.png`
                              : `/redPatientIcon.png`
                          }
                          alt={firstName + " " + lastName}
                        />
                      </button>
                    </Marker>
                  );
                })}
              </React.Fragment>
            )
          )}
          {selectedPatient && (
            <Popup
              latitude={selectedPatient.location.coordinates[0]}
              longitude={selectedPatient.location.coordinates[1]}
              onClose={() => setSelectedPatient(null)}
              className={
                selectedPatient.isVaccinated ? `popup-green` : `popup-red`
              }
            >
              <div
                className={
                  selectedPatient.isVaccinated
                    ? `popup-green popup`
                    : `popup-red popup`
                }
              >
                <Typography variant="body1">
                  <b style={{ marginRight: "7px" }}>Name</b>
                  {selectedPatient.firstName + " " + selectedPatient.lastName}
                </Typography>
                <Typography variant="body1">
                  <b style={{ marginRight: "7px" }}>Email</b>
                  <a
                    style={{
                      textDecoration: "none",
                      color: "grey",
                    }}
                    href={`mailto:${selectedPatient.email}`}
                  >
                    {selectedPatient.email}
                  </a>
                </Typography>
                <Typography variant="body1">
                  <b style={{ marginRight: "7px" }}>Score</b>
                  {selectedPatient.covidVulnerabilityScore}
                </Typography>
                <Typography variant="body1">
                  <b style={{ marginRight: "7px" }}>Date</b>
                  {selectedPatient.vaccinationDate},{" "}
                  {selectedPatient.vaccinationTimeSlot}
                </Typography>
              </div>
            </Popup>
          )}
        </ReactMapGL>
      </div>
    </Container>
  );
};
