import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../../../AuthContext";
import {
  Card,
  CardContent,
  Button,
  Typography,
  CircularProgress,
  Modal,
  Box,
} from "@mui/material";

const FetchIncomeTarget = () => {
  const [incomeTypeTargets, setIncomeTypeTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { userId } = useContext(AuthContext);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({
    income_type: "",
    monthly_target: "",
  });
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState(null);

  useEffect(() => {
    const fetchIncomeTypeTargets = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/income-type-target/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch income types and targets");
        }
        const data = await response.json();
        setIncomeTypeTargets(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchIncomeTypeTargets();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const openEditModal = (target) => {
    setEditTarget(target);
    setEditForm({
      income_type: target.income_type,
      monthly_target: target.monthly_target,
    });
    setEditModalOpen(true);
  };

  const updateIncomeTarget = async (targetId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/income-type-target/${userId}/${targetId.$oid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      if (response.ok) {
        setIncomeTypeTargets((prevTargets) =>
          prevTargets.map((t) =>
            t._id === targetId ? { ...t, ...editForm } : t
          )
        );
        setEditModalOpen(false);
        setEditTarget(null);
        setError("");
      } else {
        setError("Failed to update income target");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const openDeleteModal = (targetId) => {
    setTargetToDelete(targetId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteIncomeTarget = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/income-type-target/${targetToDelete.$oid}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIncomeTypeTargets((prevTargets) =>
          prevTargets.filter((t) => t._id !== targetToDelete)
        );
        setDeleteModalOpen(false);
        setError("");
      } else {
        setError("Failed to delete income target");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div className="max-w-7xl mx-auto bg-white p-5 rounded-md shadow-md">
      {incomeTypeTargets.length === 0 ? (
        <Typography>No income types and targets found</Typography>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomeTypeTargets.map((record) => (
            <Card
              key={record._id.$oid}
              className="shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <CardContent>
                <Typography variant="h6" component="p">
                  <strong>Income Type:</strong> {record.income_type}
                </Typography>
                <Typography component="p">
                  <strong>Income this Month:</strong> $
                  {record.income_this_month}
                </Typography>
                <Typography component="p">
                  <strong>Income Target:</strong> ${record.monthly_target}
                </Typography>
                <Typography component="p">
                  {record.income_utilization}
                </Typography>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => openEditModal(record)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => openDeleteModal(record._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <Box className="p-5 bg-white rounded shadow-md max-w-md mx-auto mt-20">
          <Typography variant="h5" className="font-bold mb-4">
            Edit Income Target
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateIncomeTarget(editTarget._id);
            }}
          >
            <label className="block mb-2">
              Income Type:
              <input
                type="text"
                name="income_type"
                value={editForm.income_type}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
            </label>
            <label className="block mb-2">
              Monthly Target:
              <input
                type="number"
                name="monthly_target"
                value={editForm.monthly_target}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
              />
            </label>
            <Button
              type="submit"
              variant="contained"
              color="success"
              className="mt-2"
            >
              Save Changes
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <Box className="p-5 bg-white rounded shadow-md max-w-md mx-auto mt-20">
          <Typography variant="h6" className="mb-4">
            Are you sure you want to delete this income target?
          </Typography>
          <div className="flex gap-4">
            <Button
              variant="contained"
              color="secondary"
              onClick={confirmDeleteIncomeTarget}
            >
              Confirm
            </Button>
            <Button
              variant="outlined"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default FetchIncomeTarget;
