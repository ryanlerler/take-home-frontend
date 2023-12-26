import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../constants";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

export default function Statistics() {
  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Risk Scenario Distribution",
        data: [],
        backgroundColor: [],
        borderWidth: 1,
      },
    ],
  });
  const [projectRiskScenarios, setProjectRiskScenarios] = useState([]);

  useEffect(() => {
    const fetchProjectRiskScenario = async () => {
      const { data } = await axios.get(`${BACKEND_URL}/project-risk-scenario`);
      setProjectRiskScenarios(data);
    };

    fetchProjectRiskScenario();
  }, []);

  useEffect(() => {
    const riskScenarioCounts = projectRiskScenarios.reduce((acc, scenario) => {
      acc[scenario.riskScenario.name] =
        (acc[scenario.riskScenario.name] || 0) + 1;
      return acc;
    }, {});

    console.log(riskScenarioCounts);

    const backgroundColors = [
      "red",
      "blue",
      "green",
      "yellow",
      "orange",
      "purple",
      "gray",
      "pink",
      "magenta",
    ];

    const data = {
      labels: Object.keys(riskScenarioCounts),
      datasets: [
        {
          label: "Risk Scenario Distribution",
          data: Object.values(riskScenarioCounts),
          backgroundColor: backgroundColors.slice(
            0,
            Object.keys(riskScenarioCounts).length
          ),
          borderWidth: 1,
        },
      ],
    };

    console.log("Pie Chart Data: ", data);
    setPieChartData(data);
  }, [projectRiskScenarios]);

  return (
    <div>
      <h2>Risk Scenario Distribution</h2>
      {pieChartData.labels.length > 0 && <Pie data={pieChartData} />}
    </div>
  );
}
