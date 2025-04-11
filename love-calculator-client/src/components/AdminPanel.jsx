import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaHeart,
  FaSearch,
  FaTrash,
  FaBroom,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./AdminPanel.css";

const AdminPanel = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        "https://love-calculator-i7d3.onrender.com/api/admin/results",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResults(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching results:", error);
      toast.error("Failed to fetch results");
      setLoading(false);
    }
  };

  const deleteResult = async (id) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        `https://love-calculator-i7d3.onrender.com/api/admin/results/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Entry deleted successfully");
      fetchResults(); // Refresh the list
    } catch (error) {
      console.error("Error deleting result:", error);
      toast.error("Failed to delete entry");
    } finally {
      setDeletingId(null);
    }
  };

  const clearAllResults = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(
        "https://love-calculator-i7d3.onrender.com/api/admin/results",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("All entries cleared successfully");
      setResults([]);
      setConfirmClear(false);
    } catch (error) {
      console.error("Error clearing results:", error);
      toast.error("Failed to clear entries");
    }
  };

  const filteredResults = results.filter(
    (result) =>
      result.name1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.name2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="admin-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <h2>Admin Panel</h2>

      <div className="admin-controls">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by names or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="action-buttons">
          {confirmClear ? (
            <div className="confirmation-buttons">
              <button className="confirm-button" onClick={clearAllResults}>
                <FaCheck /> Confirm Clear All
              </button>
              <button
                className="cancel-button"
                onClick={() => setConfirmClear(false)}>
                <FaTimes /> Cancel
              </button>
            </div>
          ) : (
            <motion.button
              className="clear-all-button"
              onClick={() => setConfirmClear(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              <FaBroom /> Clear All Entries
            </motion.button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="results-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name 1</th>
                <th>Name 2</th>
                <th>Percentage</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <motion.tr
                  key={result._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}>
                  <td>{result.uniqueId}</td>
                  <td>{result.name1}</td>
                  <td>{result.name2}</td>
                  <td>
                    <div className="percentage-cell">
                      <FaHeart style={{ color: "#ff6b6b" }} />{" "}
                      {result.percentage}%
                    </div>
                  </td>
                  <td>{new Date(result.date).toLocaleString()}</td>
                  <td>
                    <motion.button
                      className="delete-button"
                      onClick={() => deleteResult(result._id)}
                      disabled={deletingId === result._id}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}>
                      {deletingId === result._id ? "Deleting..." : <FaTrash />}
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminPanel;
