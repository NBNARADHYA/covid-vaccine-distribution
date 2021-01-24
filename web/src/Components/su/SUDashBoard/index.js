import { Container, Typography } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import { AccessTokenContext } from "../../../Contexts/AccessToken";
import ReactMapGL, { Marker, Popup } from "react-map-gl";

export const SUDashBoard = () => {
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

  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
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

  return (
    <Container style={{ paddingTop: "3vh" }}>
      <Typography variant="h4" color="primary" style={{ marginBottom: "3vh" }}>
        <span style={{ marginRight: "30px" }}>
          Vaccination Production Center Details
        </span>
      </Typography>
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
