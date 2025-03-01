import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ targetAmount, currentAmount }) => {
  const remainingAmount = targetAmount - currentAmount;

  const data = {
    labels: ["Current Amount", "Remaining Amount"],
    datasets: [
      {
        label: "Goal Progress",
        data: [currentAmount, remainingAmount],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <Doughnut
      data={data}
      options={{
        cutout: "60%",
        plugins: {
          legend: {
            display: true,
          },
        },
      }}
    />
  );
};

export default DoughnutChart;
