import { useAuth0 } from "@auth0/auth0-react";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { useContext } from "react";
import { UserContext } from "../App";
import ProjectManagerView from "../components/ProjectManagerView";
import RiskConsultantView from "../components/RiskConsultantView";
import { useNavigate } from "react-router-dom";

export default function Home({ riskScenarios }) {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div>
        <Button variant="primary" disabled>
          <Spinner as="span" animation="grow" size="sm" />
          Loading ...
        </Button>
      </div>
    );
  }

  const handlePmLogin = () => {
    loginWithRedirect();
    if (!isLoading && user) {
      axios.post(`${BACKEND_URL}/users`, {
        email: user.email,
        name: user.nickname,
        role: "PM",
      });
    }
  };

  const handleRcLogin = () => {
    loginWithRedirect();
    if (!isLoading && user) {
      axios.post(`${BACKEND_URL}/users`, {
        email: user.email,
        name: user.nickname,
        role: "RC",
      });
    }
  };

  return (
    <>
      {!user && <Button onClick={handlePmLogin}>Log In as PM</Button>}
      {!user && <Button onClick={handleRcLogin}>Log In as RC</Button>}
      <Button
        onClick={() => {
          localStorage.removeItem("token");

          logout({ logoutParams: { returnTo: window.location.origin } });
        }}
      >
        Log Out
      </Button>

      {isAuthenticated && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}

      {userContext.loggedInUser.role === "PM" && (
        <ProjectManagerView riskScenarios={riskScenarios} />
      )}
      {userContext.loggedInUser.role === "RC" && (
        <RiskConsultantView riskScenarios={riskScenarios} />
      )}

      {isAuthenticated && (
        <Button onClick={() => navigate("/project-risk")}>
          View Risk Table
        </Button>
      )}
    </>
  );
}
