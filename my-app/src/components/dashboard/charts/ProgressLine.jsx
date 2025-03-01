import React, { useState, useEffect } from "react";
import { differenceInMilliseconds, parseISO } from "date-fns";

const ProgressLine = ({ startDate, endDate }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const now = new Date();

    const totalDuration = differenceInMilliseconds(end, start);
    const elapsedDuration = differenceInMilliseconds(now, start);

    const progressPercentage = (elapsedDuration / totalDuration) * 100;

    setProgress(Math.min(progressPercentage, 100)); // Ensure progress does not exceed 100%
  }, [startDate, endDate]);

  return (
    <div
      style={{ width: "100%", backgroundColor: "#e0e0e0", borderRadius: "5px" }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "20px",
          backgroundColor: "#76c7c0",
          borderRadius: "5px",
          transition: "width 0.5s ease-in-out",
        }}
      />
    </div>
  );
};

export default ProgressLine;
