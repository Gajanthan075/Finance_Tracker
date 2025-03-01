import React from "react";
import { useNavigate } from "react-router-dom";

const Creation = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/create-goal");
  };

  return (
    <div>
      <div className="p-2 ml-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className="bg-slate-100 p-10 rounded-md items-center flex flex-col border-2 
                     border-dashed cursor-pointer hover:shadow-md"
            onClick={handleSubmit}
          >
            <button>
              <h2 className="text-3xl">+</h2>
            </button>
            <h2>Create New Goal</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Creation;
