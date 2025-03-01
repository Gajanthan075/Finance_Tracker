import React, { useState } from "react";
import CreateTransaction from "./CreateTransaction"; // Assuming the form is in a separate component

const Creation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      <div className="p-2 ml-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 
                     border-dashed cursor-pointer hover:shadow-md"
            onClick={toggleModal}
          >
            <button>
              <h2 className="text-3xl">+</h2>
            </button>
            <h2>Create New Transaction</h2>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
          onClick={toggleModal} // Close modal when clicking outside the form
        >
          <div
            className="bg-white p-6 rounded-md shadow-md w-11/12 md:w-1/2 lg:w-1/3"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside the form
          >
            <button
              className="text-red-500 float-right font-bold text-xl"
              onClick={toggleModal}
            >
              &times;
            </button>
            <CreateTransaction />
          </div>
        </div>
      )}
    </div>
  );
};

export default Creation;
