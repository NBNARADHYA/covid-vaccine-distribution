import { BrowserRouter as Router } from "react-router-dom";
import { AccessTokenProvider } from "../Contexts/AccessToken";
import Routes from "./Routes";
import "./app.css";

const App = () => {
  return (
    <Router>
      <AccessTokenProvider>
        <Routes />
      </AccessTokenProvider>
    </Router>
  );
};

export default App;
