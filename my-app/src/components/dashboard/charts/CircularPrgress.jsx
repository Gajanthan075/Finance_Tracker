import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularProgress = ({ loanAmount, settledAmount }) => {
  const percentage = (settledAmount / loanAmount) * 100;

  return (
    <div style={{ width: 200, height: 200 }}>
      <CircularProgressbar
        value={percentage}
        text={`${Math.round(percentage)}%`}
        styles={buildStyles({
          pathColor: `rgba(62, 152, 199, ${percentage / 100})`,
          textColor: "#4d4d4d",
          trailColor: "#d6d6d6",
          backgroundColor: "#f8f8f8",
        })}
      />
    </div>
  );
};

export default CircularProgress;
