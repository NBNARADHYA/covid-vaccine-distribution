import {
  createMuiTheme,
  responsiveFontSizes,
  makeStyles,
} from "@material-ui/core/styles";
import { amber } from "@material-ui/core/colors";

let theme = createMuiTheme({
  palette: { type: "dark", primary: amber, secondary: amber },
});

theme = responsiveFontSizes(theme);

const useStyle = makeStyles(() => ({
  root: {
    width: "auto",
    backgroundColor: "#000000",
    color: theme.palette.text.primary,
  },
}));

export { theme, useStyle };
