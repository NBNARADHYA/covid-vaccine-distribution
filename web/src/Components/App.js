import { BrowserRouter as Router } from "react-router-dom";
import { AccessTokenProvider } from "../Contexts/AccessToken";
import Routes from "./Routes";
import "./App.css";
import { Layout } from "../Layout";

const App = () => {
  return (
    <Router>
      <AccessTokenProvider>
        <Layout>
          <Routes />
        </Layout>
      </AccessTokenProvider>
    </Router>
  );
};

export default App;
