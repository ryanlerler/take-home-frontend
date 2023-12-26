import RiskScenarios from "./RiskScenarios";

export default function ProjectManagerView({ riskScenarios }) {
  return (
    <div>
      <RiskScenarios riskScenarios={riskScenarios} />
    </div>
  );
}
