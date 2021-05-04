import { BrowserRouter as Router } from "react-router-dom";
import { AccessTokenProvider } from "../Contexts/AccessToken";
import Routes from "./Routes";
import "./App.css";
import Chat from "../Components/chatbot/ChatNormal";
import { Layout } from "../Layout";

const App = () => {
  return (
    <Router>
      <AccessTokenProvider>
        <Layout>
          <Routes />
        </Layout>
      </AccessTokenProvider>
      <Chat />
    </Router>
  );
};

export default App;
