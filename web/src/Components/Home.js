import { useContext } from "react";
import { AccessTokenContext } from "../Contexts/AccessToken";
import { Container, Typography } from "@material-ui/core";

export const Home = ({ history }) => {
  const {
    accessToken,
    user: { isProfileAdded, isAdmin, vaccinationDate },
  } = useContext(AccessTokenContext);

  if (isAdmin) history.push("/admin");

  if (!accessToken) {
    history.push("/login");
    return null;
  } else if (vaccinationDate) {
    return (
      <Container style={{ paddingTop: "10vh", textAlign: "center" }}>
        <Typography variant="body1" color="secondary">
          Your vaccination has been scheduled on {vaccinationDate} !
        </Typography>
      </Container>
    );
  } else if (isProfileAdded) {
    return (
      <Container style={{ paddingTop: "10vh", textAlign: "center" }}>
        <Typography variant="body1" color="secondary">
          You have been registered for vaccination ! We will inform you when
          your date gets scheduled !
        </Typography>
      </Container>
    );
  } else {
    history.push("/register_for_covid_vaccine");
    return null;
  }
};
