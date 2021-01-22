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
} from "@material-ui/core";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { Bar } from "react-chartjs-2";
import { useContext, useEffect, useState } from "react";
import { AccessTokenContext } from "../../../Contexts/AccessToken";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { vaccinationStateDetails } from "./vaccinationStateDetails";

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
    user: { isAdmin, firstName, lastName, email },
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

  if (!isAdmin) history.push("/");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER}/admin/registered_patients`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const newRegisteredPatients = {};
        ["scheduled", "notScheduled", "vaccinated"].forEach((state) => {
          const patients = {};
          res[state].forEach((patient) => {
            const reg = patients[patient.vaccinationDate] || [];
            reg.push({ ...patient });
            patients[patient.vaccinationDate] = reg;
          });
          newRegisteredPatients[state] = patients;
        });
        setRegisteredPatients(newRegisteredPatients);
      })
      .catch(async () => {
        if (accessToken) {
          setAccessToken(null);
          await fetch(`${process.env.REACT_APP_SERVER}/logout`, {
            method: "POST",
            credentials: "include",
          });
        }
        history.push("/login");
      });
  }, [accessToken, history, setAccessToken]);

  const scheduledOrVaccinatedPatients = {
    ...registeredPatients["scheduled"],
    ...registeredPatients["vaccinated"],
  };

  return (
    <Container style={{ paddingTop: "3vh" }}>
      <Typography variant="h4" color="primary" style={{ marginBottom: "3vh" }}>
        <span style={{ marginRight: "30px" }}>Vaccination Center Details</span>
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
      <div>
        <Typography
          variant="h5"
          color="secondary"
          style={{ marginBottom: "3vh" }}
        >
          Patient Trend
        </Typography>
        <Bar
          data={{
            labels: Object.keys(scheduledOrVaccinatedPatients).map(
              (day) => day
            ),
            datasets: [
              {
                label: "Number of patients",
                data: Object.keys(scheduledOrVaccinatedPatients).map(
                  (day) => scheduledOrVaccinatedPatients[day].length
                ),
                // borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: Object.keys(
                  scheduledOrVaccinatedPatients
                ).map((day) =>
                  registeredPatients["vaccinated"][day]
                    ? "rgba(255, 99, 132, 0.2)"
                    : "rgba(54, 162, 235, 1)"
                ),
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
      </div>
      <div style={{ marginBottom: "5vh" }}>
        <Typography
          variant="h5"
          color="secondary"
          style={{ marginBottom: "3vh" }}
        >
          Patient Details
        </Typography>
        {["scheduled", "notScheduled", "vaccinated"].map((state, idx) => (
          <Accordion
            key={idx}
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
                {Object.entries(registeredPatients[state]).map(
                  ([date, patients], idx) => (
                    <Grid
                      item
                      container
                      direction="row"
                      xs={12}
                      spacing={2}
                      key={idx}
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
                            <Grid item xs={12}>
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
    </Container>
  );
};
