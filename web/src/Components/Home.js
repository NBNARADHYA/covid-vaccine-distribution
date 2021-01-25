import { useContext, useEffect, useMemo, useState } from "react";
import { AccessTokenContext } from "../Contexts/AccessToken";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import { Bar } from "react-chartjs-2";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

export const Home = ({ history }) => {
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
    latitude: 12.972442,
    longitude: 77.580643,
    zoom: 5,
  });

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

  return (
    <Container style={{ paddingTop: "5vh" }}>
      {accessToken && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            history.push("/user/dashboard");
          }}
        >
          View Dashboard
        </Button>
      )}
      <div style={{ marginBottom: "3vh" }}>
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
      <div style={{ marginBottom: " 3vh" }}>
        <Typography
          variant="h5"
          color="secondary"
          style={{ marginBottom: "2vh" }}
        >
          Vaccination centres accross India
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
                    {selectedAdmin.email}
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
