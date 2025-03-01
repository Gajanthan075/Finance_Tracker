import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import CreateIncomeTarget from "./CreateIncomeTarget"; // Adjust the path based on your file structure

const Creation = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          className="bg-white p-10 rounded-md shadow-md flex flex-col items-center justify-center 
                     border-2 border-dashed border-gray-300 cursor-pointer transition-transform 
                     duration-300 ease-in-out hover:shadow-lg hover:scale-105"
          onClick={handleOpenModal}
        >
          <button className="flex items-center justify-center mb-4">
            <h2 className="text-5xl text-blue-600">+</h2>
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Create New Income Target
          </h2>
        </div>
      </div>

      {/* Modal containing CreateIncomeTarget */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          className="p-6 bg-white rounded shadow-md max-w-md mx-auto mt-20"
          sx={{ outline: "none" }}
        >
          <CreateIncomeTarget />
        </Box>
      </Modal>
    </div>
  );
};

export default Creation;
