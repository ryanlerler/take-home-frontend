import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { BACKEND_URL } from "../constants";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
import Statistics from "../components/Statistics";

export default function ProjectRiskTable() {
  const [mitigationStatuses, setMitigationStatuses] = useState([]);
  const [projectRiskScenarios, setProjectRiskScenarios] = useState([]);
  const [mitigationStatusId, setMitigationStatusId] = useState(1);
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMitigationStatus = async () => {
      const { data } = await axios.get(`${BACKEND_URL}/mitigation-status`);
      setMitigationStatuses(data);
    };

    fetchMitigationStatus();
  }, []);

  useEffect(() => {
    const fetchProjectRiskScenario = async () => {
      const { data } = await axios.get(`${BACKEND_URL}/project-risk-scenario`);
      setProjectRiskScenarios(data);
    };

    fetchProjectRiskScenario();
  }, []);

  console.log(projectRiskScenarios);

  const handleClick = async (id) => {
    await axios.delete(`${BACKEND_URL}/project-risk-scenario/${id}`);
    setProjectRiskScenarios(projectRiskScenarios.filter((p) => p.id !== id));
    alert("DELETED");
  };

  const handleSubmit = async (e, id) => {
    e.preventDefault();

    const { data } = await axios.put(
      `${BACKEND_URL}/project-risk-scenario/${id}`,
      {
        mitigationStatusId,
      }
    );
    alert("UPDATED");
    setProjectRiskScenarios(
      projectRiskScenarios.map((p) => {
        if (p.id === id)
          return { ...p, mitigationStatus: data.mitigationStatus };
        return p;
      })
    );
  };

  return (
    <div>
      <Button onClick={() => navigate("/")}>Home</Button>

      <h2>Risk Table</h2>

      <Table striped bordered hover>
        <thead>
          <tr>
            <td>#</td>
            <td>PM</td>
            <td>Project</td>
            <td>Risk Scenario Name</td>
            <td>Mitigation Status</td>
            {userContext.loggedInUser.role === "PM" && <td>Edit</td>}
            {userContext.loggedInUser.role === "PM" && <td>Delete</td>}
          </tr>
        </thead>

        {projectRiskScenarios &&
          projectRiskScenarios.length > 0 &&
          projectRiskScenarios.map((p, index) => {
            return (
              <tbody key={p.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{p.projectRisk.user.name}</td>
                  <td>{p.projectRisk.name}</td>
                  <td>{p.riskScenario.name}</td>
                  <td>{p.mitigationStatus.status}</td>

                  {userContext.loggedInUser.email ===
                    p.projectRisk.user.email && (
                    <td>
                      <Form onSubmit={(e) => handleSubmit(e, p.id)}>
                        <Form.Select
                          onChange={({ target }) =>
                            setMitigationStatusId(target.value)
                          }
                        >
                          {mitigationStatuses.map((m) => {
                            return (
                              <option key={m.id} value={m.id}>
                                {m.status}
                              </option>
                            );
                          })}
                        </Form.Select>
                        <Button type="submit">Submit</Button>
                      </Form>
                    </td>
                  )}

                  {userContext.loggedInUser.email ===
                    p.projectRisk.user.email && (
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleClick(p.id)}
                      >
                        X
                      </Button>
                    </td>
                  )}
                </tr>
              </tbody>
            );
          })}
      </Table>

      {userContext.loggedInUser.role === "RC" && <Statistics />}
    </div>
  );
}
