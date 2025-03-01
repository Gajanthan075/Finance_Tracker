import React from "react";

const ProgressBar = ({ nextPaymentDate }) => {
  const calculateProgress = () => {
    const now = new Date();
    const nextPayment = new Date(nextPaymentDate);
    const totalDays = Math.floor((nextPayment - now) / (1000 * 60 * 60 * 24));
    const pastDays = Math.floor(
      (now - nextPayment.setMonth(nextPayment.getMonth() - 1)) /
        (1000 * 60 * 60 * 24)
    );
    const progress = Math.max((pastDays / totalDays) * 100, 0);

    return progress > 100 ? 100 : progress;
  };

  const progress = calculateProgress();

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
