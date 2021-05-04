import {
  createMuiTheme,
  responsiveFontSizes,
  makeStyles,
} from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";

let theme = createMuiTheme({
  palette: { primary: blue, secondary: blue },
});

theme = responsiveFontSizes(theme);

const useStyle = makeStyles(() => ({
  root: {
    width: "auto",
    backgroundColor: "#ffffff",
    color: '#000000',
  },
}));

export { theme, useStyle };
