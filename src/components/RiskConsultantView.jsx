import RiskScenarios from "./RiskScenarios";

export default function RiskConsultantView({riskScenarios}) {
  return (
    <div>
      <RiskScenarios riskScenarios={riskScenarios} />
    </div>
  );
}
