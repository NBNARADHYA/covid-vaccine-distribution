import { useContext, useEffect, useMemo, useState } from "react";
import { AccessTokenContext } from "../../Contexts/AccessToken";
import {
  Button,
  Container,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  MobileStepper,
  Paper,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { Bar } from "react-chartjs-2";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { plots } from "./plots";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: "#ff9800",
    color: "black",
  },
  img: {
    display: "block",
    overflow: "hidden",
    width: "100%",
  },
}));

export const Home = ({ history }) => {
  const classes = useStyles();
  const {
    accessToken,
    user: { isAdmin, isSuperUser },
  } = useContext(AccessTokenContext);
  const [patients, setPatients] = useState([]);
  const [lastNumDays, setLastNumDays] = useState(30);
  const [nextNumDays, setNextNumDays] = useState(30);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const [viewport, setViewport] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    zoom: 3.5,
  });
  const theme = useTheme();
  const [activePlotStep, setActivePlotStep] = useState(0);
  const maxSteps = plots.length;

  const handlePlotNext = () => {
    setActivePlotStep((prevActivePlotStep) => prevActivePlotStep + 1);
  };

  const handlePlotBack = () => {
    setActivePlotStep((prevActivePlotStep) => prevActivePlotStep - 1);
  };

  const handlePlotStepChange = (step) => {
    setActivePlotStep(step);
  };

  useEffect(() => {
    let url = `${process.env.REACT_APP_SERVER}/patient_trend?`;
    if (lastNumDays) {
      url += `lastNumDays=${lastNumDays}&`;
    }
    if (nextNumDays) {
      url += `nextNumDays=${nextNumDays}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((res) => setPatients(res.patients))
      .catch(console.error);
  }, [lastNumDays, nextNumDays]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER}/admins`)
      .then((res) => res.json())
      .then(async (res) => setAdmins(res.admins))
      .catch(console.error);
  }, []);

  const patientTrendDates = useMemo(() => {
    const map = {},
      dates = [];
    patients.forEach((patient) => {
      if (!map[patient.vaccinationDate]) dates.push(patient.vaccinationDate);
    });
    return dates;
  }, [patients]);

  if (isSuperUser) {
    history.push("/su/dashboard");
    return null;
  } else if (isAdmin) {
    history.push("/admin/dashboard");
    return null;
  }

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 350,
      },
    },
  };

  return (
    <Container style={{ paddingTop: "5vh" }}>
      {accessToken && (
        <IconButton
          onClick={() => {
            history.push("/user/dashboard");
          }}
          style={{ marginBottom: "20px" }}
        >
          <DashboardIcon fontSize="small" />
          &nbsp; View Dashboard
        </IconButton>
      )}
      <div style={{ marginBottom: "10vh" }}>
        <Typography
          variant="h5"
          color="secondary"
          style={{ marginBottom: "6vh" }}
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
              legend: {
                labels: {
                  fontColor: "white",
                  fontSize: 18,
                },
              },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      fontColor: "white",
                      fontSize: 18,
                      beginAtZero: true,
                    },
                  },
                ],
                xAxes: [
                  {
                    ticks: {
                      fontColor: "white",
                      fontSize: 14,
                    },
                  },
                ],
              },
            }}
          />
        )}
      </div>
      <Grid container spacing={3} style={{ paddingBottom: "6vh" }}>
        <Grid item xs={12} lg={6}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ marginBottom: "2.7vh" }}
          >
            <span style={{ marginRight: "20px" }}>
              Insights from the Dataset
            </span>
            <span>
              <Select
                value={activePlotStep}
                onChange={(e) => setActivePlotStep(parseInt(e.target.value))}
                MenuProps={MenuProps}
              >
                {plots.map(({ label }, index) => (
                  <MenuItem value={index} key={index}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </span>
          </Typography>
          <Paper square elevation={0} className={classes.header}>
            <Typography>{plots[activePlotStep].label}</Typography>
          </Paper>
          <AutoPlaySwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={activePlotStep}
            onChangeIndex={handlePlotStepChange}
            enableMouseEvents
          >
            {plots.map(({ url, label }, index) => (
              <div key={label}>
                {Math.abs(activePlotStep - index) <= 2 ? (
                  <img className={classes.img} src={url} alt={label} />
                ) : null}
              </div>
            ))}
          </AutoPlaySwipeableViews>
          <MobileStepper
            steps={maxSteps}
            position="static"
            variant="text"
            style={{ backgroundColor: "#ff9800", color: "black" }}
            activeStep={activePlotStep}
            nextButton={
              <Button
                size="small"
                onClick={handlePlotNext}
                disabled={activePlotStep === maxSteps - 1}
                style={{ color: "black" }}
              >
                Next
                {theme.direction === "rtl" ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size="small"
                onClick={handlePlotBack}
                disabled={activePlotStep === 0}
                style={{ color: "black" }}
              >
                {theme.direction === "rtl" ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ marginBottom: "3vh" }}
          >
            Vaccination centres accross India
          </Typography>
          <ReactMapGL
            {...viewport}
            onViewportChange={(viewport) => setViewport(viewport)}
            height="520px"
            width="700px"
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
                      {selectedAdmin.email}
                    </a>
                  </Typography>
                </div>
              </Popup>
            )}
          </ReactMapGL>
        </Grid>
      </Grid>
    </Container>
  );
};
