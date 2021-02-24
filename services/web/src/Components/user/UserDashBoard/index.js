import React from "react";
import { Button, Container, Typography } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { AccessTokenContext } from "../../../Contexts/AccessToken";
import ReactMapGL, { Layer, Marker, Popup, Source } from "react-map-gl";
import mapboxgl from "mapbox-gl";
import { point, nearestPoint, featureCollection } from "@turf/turf";

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

export const UserDashBoard = ({ history }) => {
  const {
    user: {
      firstName,
      lastName,
      email,
      location: { coordinates },
      isVaccinated,
      isProfileAdded,
    },
  } = useContext(AccessTokenContext);

  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [shortestPathLine, setShortestPathLine] = useState(null);
  const [nearestAdmin, setNearestAdmin] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: coordinates[0],
    longitude: coordinates[1],
    zoom: 5,
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_SERVER}/admins`)
      .then((res) => res.json())
      .then((res) => {
        setAdmins(res.admins);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (admins.length) {
      const myPoint = point(coordinates);
      const adminPoints = admins.map(({ location }) =>
        point(location.coordinates)
      );
      const nearestPt = nearestPoint(myPoint, featureCollection(adminPoints));
      setNearestAdmin(
        admins.find(
          ({ location: { coordinates } }) =>
            coordinates[0] === nearestPt.geometry.coordinates[0] &&
            coordinates[1] === nearestPt.geometry.coordinates[1]
        )
      );
      setShortestPathLine({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: [
            [coordinates[1], coordinates[0]],
            [
              nearestPt.geometry.coordinates[1],
              nearestPt.geometry.coordinates[0],
            ],
          ],
        },
      });
    }
  }, [admins, coordinates]);

  return (
    <Container style={{ paddingTop: "3vh" }}>
      <Typography variant="h4" color="primary" style={{ marginBottom: "3vh" }}>
        <span style={{ marginRight: "30px" }}>Dashboard</span>
        <span>
          <Button
            variant="contained"
            onClick={() => history.push("/user/register_for_covid_vaccine")}
            disabled={isProfileAdded}
          >
            {isProfileAdded
              ? "You have registered for vaccination"
              : "Register for vaccination"}
          </Button>
        </span>
      </Typography>
      <div style={{ marginBottom: "3vh" }}>
        <div style={{ marginBottom: "2vh" }}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ marginBottom: "1vh" }}
          >
            Name
          </Typography>
          <Typography variant="body1">{firstName + " " + lastName}</Typography>
        </div>
        <div style={{ marginBottom: "2vh" }}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ marginBottom: "1vh" }}
          >
            Email
          </Typography>
          <Typography variant="body1">{email}</Typography>
        </div>
      </div>
      <div style={{ paddingBottom: " 3vh" }}>
        <div style={{ marginBottom: "3vh" }}>
          <Typography
            variant="h5"
            color="secondary"
            style={{ marginBottom: "2vh" }}
          >
            Your nearest vaccination center
          </Typography>
          {nearestAdmin && (
            <div>
              <Typography variant="body1">
                <b style={{ marginRight: "7px" }}>Admin Name</b>
                {nearestAdmin.firstName + " " + nearestAdmin.lastName}
              </Typography>
              <Typography variant="body1">
                <b style={{ marginRight: "7px" }}>Email</b>
                <a
                  style={{
                    textDecoration: "none",
                    color: "grey",
                  }}
                  href={`mailto:${nearestAdmin.email}`}
                >
                  {nearestAdmin.email}
                </a>
              </Typography>
            </div>
          )}
        </div>
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
              <img
                src={
                  !isVaccinated
                    ? "/redPatientIcon.png"
                    : "/greenPatientIcon.png"
                }
                alt={firstName + " " + lastName}
              />
            </button>
          </Marker>
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
          {shortestPathLine && (
            <Source id="src" type="geojson" data={shortestPathLine}>
              <Layer
                type="line"
                paint={{
                  "line-color": "#ff0066",
                  "line-width": 3,
                }}
                source="src"
                layout={{
                  "line-join": "round",
                  "line-cap": "round",
                }}
              />
            </Source>
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
