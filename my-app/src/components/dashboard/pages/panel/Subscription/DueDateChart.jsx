import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const DueDateChart = ({ subscriptions }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Convert subscription data to chart data format
    const formattedData = subscriptions.map((subscription) => ({
      name: subscription.name,
      dueDate: new Date(subscription.dueDate).toLocaleDateString(),
      amount: subscription.amount,
    }));
    setChartData(formattedData);
  }, [subscriptions]);

  return (
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DueDateChart;
