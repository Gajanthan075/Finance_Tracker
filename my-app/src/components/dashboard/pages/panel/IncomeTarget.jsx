import React from "react";
import CreateIncomeTarget from "../panel/IncomeTarget/CreateIncomeTarget";
import FetchIncomeTarget from "../panel/IncomeTarget/FetchIncomeTarget";

const IncomeTarget = () => {
  return (
    <div>
      <CreateIncomeTarget />
      <FetchIncomeTarget />
    </div>
  );
};

export default IncomeTarget;
