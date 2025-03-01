import React, { useState } from "react";
import CreateAccount from "./CreateAccount";

const Creation = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className="p-2 ml-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 
                     border-dashed cursor-pointer hover:shadow-md"
            onClick={openModal}
          >
            <button>
              <h2 className="text-3xl">+</h2>
            </button>
            <h2>Create New Account</h2>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg  relative w-full max-w-lg">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              onClick={closeModal}
            >
              ✖
            </button>
            <CreateAccount />
          </div>
        </div>
      )}
    </div>
  );
};

export default Creation;
