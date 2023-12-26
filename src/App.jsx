import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { useEffect, useState, createContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { BACKEND_URL } from "./constants";
import axios from "axios";
import ScrollToTop from "react-scroll-to-top";
import AddForm from "./pages/AddForm";
import ProjectRiskTable from "./pages/ProjectRiskTable";

export const UserContext = createContext();

function App() {
  const [riskScenarios, setRiskScenarios] = useState({});
  const [loggedInUser, setLoggedInUser] = useState({});
  const { user, getAccessTokenSilently } = useAuth0();
  const value = { loggedInUser, setLoggedInUser };

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get(`${BACKEND_URL}/users`, {
        params: {
          email: user.email,
        },
      });
      if (data) {
        setLoggedInUser(data);
      }
    };

    if (user) {
      fetchUser();
    }
  }, [user]);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUDIENCE,
          scope: "read:current_user",
        },
      });

      localStorage.setItem("token", token);
    };

    if (user) {
      fetchToken();
    }
  }, [getAccessTokenSilently, user]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`${BACKEND_URL}/risk-scenarios`);
      setRiskScenarios(data);
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <UserContext.Provider value={value}>
          <ScrollToTop color="black" width="15" height="30" />

          <Routes>
            <>
              <Route index element={<Home riskScenarios={riskScenarios} />} />
              <Route
                path="/add"
                element={<AddForm riskScenarios={riskScenarios} />}
              />
              <Route path="/project-risk" element={<ProjectRiskTable />} />
            </>
          </Routes>
        </UserContext.Provider>
      </header>
    </div>
  );
}

export default App;
