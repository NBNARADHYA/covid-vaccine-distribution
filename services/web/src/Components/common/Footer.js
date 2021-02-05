import { Typography } from "@material-ui/core";

export const Footer = () => (
  <Typography className="footer" color="primary">
    © Copyright {new Date().getFullYear()}
    &nbsp;
    <a href="/" target="_blank" rel="noopener noreferrer">
      Team Infinity
    </a>
  </Typography>
);
