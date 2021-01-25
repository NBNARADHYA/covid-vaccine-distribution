import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { Header } from "../Components/common/Header";
import { theme, useStyle } from "./styles";

export const Layout = ({ children }) => {
  const classes = useStyle();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <div
        style={{
          minHeight: "98vh",
          position: "relative",
        }}
        className={classes.root}
      >
        {children}
      </div>
    </ThemeProvider>
  );
};
