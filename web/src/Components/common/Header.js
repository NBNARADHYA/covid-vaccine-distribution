import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link, useHistory, useLocation } from "react-router-dom";
import { AccessTokenContext } from "../../Contexts/AccessToken";
// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    textDecoration: "none",
    color: "white",
  },
}));

export const Header = () => {
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation();
  const {
    accessToken,
    setAccessToken,
    user: { isAdmin },
  } = useContext(AccessTokenContext);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton> */}
          <Typography variant="h6" className={classes.title}>
            <Link className={classes.link} to="/">
              Covid Vaccine Distribution
            </Link>
          </Typography>
          {isAdmin &&
            location.pathname !==
              "/admin/register_patients_for_vaccination" && (
              <Button
                color="inherit"
                onClick={() =>
                  history.push(`/admin/register_patients_for_vaccination`)
                }
              >
                Register patients for Vaccination
              </Button>
            )}
          <Button
            color="inherit"
            onClick={async () => {
              if (accessToken) {
                setAccessToken(null);
                await fetch(`${process.env.REACT_APP_SERVER}/logout`, {
                  method: "POST",
                  credentials: "include",
                });
              }
              history.push("/login");
            }}
          >
            {accessToken
              ? "Logout"
              : location.pathname !== "/login"
              ? "Login"
              : ""}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
