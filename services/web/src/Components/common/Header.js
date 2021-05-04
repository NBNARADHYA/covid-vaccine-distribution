import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Link, useHistory, useLocation } from "react-router-dom";
import { AccessTokenContext } from "../../Contexts/AccessToken";

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
  login: {
    fontSize: "20px",
  },
}));

export const Header = () => {
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation();
  const { accessToken, setAccessToken } = useContext(AccessTokenContext);

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            <Link className={classes.link} to="/">
              Team Infinity
            </Link>
          </Typography>
          <Button
            color="inherit"
            className={classes.login}
            onClick={async () => {
              if (accessToken) {
                setAccessToken(null);
                await fetch(`${process.env.REACT_APP_SERVER}/auth/logout`, {
                  method: "POST",
                  credentials: "include",
                });
                history.push("/");
              } else {
                history.push("/auth/login");
              }
            }}
          >
            {accessToken
              ? "Logout"
              : location.pathname !== "/auth/login"
              ? "Login"
              : ""}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
