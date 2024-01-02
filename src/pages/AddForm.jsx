import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { useContext } from "react";
import { UserContext } from "../App";
import { Button, Form } from "react-bootstrap";

export default function AddForm({ riskScenarioId }) {
  const [projectRisk, setProjectRisk] = useState([]);
  const [projectRiskId, setProjectRiskId] = useState(1);
  const userContext = useContext(UserContext);

  console.log(projectRiskId);
  useEffect(() => {
    const fetchProjectRisk = async () => {
      const { data } = await axios.get(`${BACKEND_URL}/project-risk`);
      setProjectRisk(data);
    };

    fetchProjectRisk();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data } = await axios.post(`${BACKEND_URL}/project-risk`, {
      email: userContext.loggedInUser.email,
      riskScenarioId,
      projectRiskId,
      mitigationStatusId: 1,
    });
    console.log(data);
    alert("Added");
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Label>Project</Form.Label>
        <Form.Select
          onChange={({ target }) => setProjectRiskId(Number(target.value))}
        >
          {projectRisk.slice(0, 3).map((p) => {
            return (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            );
          })}
        </Form.Select>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
}
