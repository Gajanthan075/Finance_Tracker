import React, { useState } from "react";
import CreateExpenseBudget from "./CreateExpensBudget";

const Creation = () => {
  const [showPopup, setShowPopup] = useState(false);

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <div className="p-2 ml-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 
                     border-dashed cursor-pointer hover:shadow-md"
            onClick={openPopup}
          >
            <button>
              <h2 className="text-3xl">+</h2>
            </button>
            <h2>Create New Expense Type & Budget</h2>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-md shadow-lg w-full max-w-md relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <CreateExpenseBudget onClose={closePopup} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Creation;
