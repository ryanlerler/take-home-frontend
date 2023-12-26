import { useContext } from "react";
import { Table } from "react-bootstrap";
import { UserContext } from "../App";
import AddForm from "../pages/AddForm";

export default function RiskScenarios({ riskScenarios }) {
  const userContext = useContext(UserContext);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <td>#</td>
          <td>Risk Scenario Name</td>
          <td>Risk Scenario Description</td>
          <td>Mitigation Strategy</td>
          {userContext.loggedInUser.role === "PM" && <td>Add To Project</td>}
        </tr>
      </thead>

      {riskScenarios &&
        riskScenarios.length > 0 &&
        riskScenarios.map((r) => {
          return (
            <tbody key={r.name}>
              <tr>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.description}</td>
                <td>{r.mitigationStrategy}</td>
                {userContext.loggedInUser.role === "PM" && (
                  <td>
                    <AddForm riskScenarioId={r.id} />
                  </td>
                )}
              </tr>
            </tbody>
          );
        })}
    </Table>
  );
}
