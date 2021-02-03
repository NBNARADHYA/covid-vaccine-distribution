import { ThemeProvider } from "@material-ui/core";
import { Footer } from "../Components/common/Footer";
import { Header } from "../Components/common/Header";
import { theme, useStyle } from "./styles";

export const Layout = ({ children }) => {
  const classes = useStyle();

  return (
    <ThemeProvider theme={theme}>
      <Header />
      <div
        style={{
          minHeight: "94vh",
          position: "relative",
        }}
        className={classes.root}
      >
        <div className="content-wrap">{children}</div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};
