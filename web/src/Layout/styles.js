import {
  createMuiTheme,
  responsiveFontSizes,
  makeStyles,
} from "@material-ui/core/styles";
import { cyan } from "@material-ui/core/colors";

let theme = createMuiTheme({
  palette: { type: "dark", primary: cyan, secondary: cyan },
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
