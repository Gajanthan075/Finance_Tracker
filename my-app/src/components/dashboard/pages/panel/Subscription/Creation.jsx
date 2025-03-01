import React, { useState } from "react";
import CreateSubscription from "./CreateSubscription";

const Creation = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div>
      <div className="p-2 ml-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 
                     border-dashed cursor-pointer hover:shadow-md"
            onClick={handleOpenPopup}
          >
            <button>
              <h2 className="text-3xl">+</h2>
            </button>
            <h2>Create New Subscription</h2>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleClosePopup}
            >
              ✖
            </button>
            <CreateSubscription />
          </div>
        </div>
      )}
    </div>
  );
};

export default Creation;
