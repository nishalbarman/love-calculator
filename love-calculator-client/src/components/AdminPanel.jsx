import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaHeart, FaSearch } from 'react-icons/fa';

const AdminPanel = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await axios.get('http://localhost:5000/api/admin/results', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const filteredResults = results.filter(result => 
    result.name1.toLowerCase().includes(searchTerm.toLowerCase()) || 
    result.name2.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.uniqueId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className="admin-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2>Admin Panel</h2>
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search by names or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((result) => (
                <motion.tr
                  key={result._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <td>{result.uniqueId}</td>
                  <td>{result.name1}</td>
                  <td>{result.name2}</td>
                  <td>
                    <div className="percentage-cell">
                      <FaHeart style={{ color: '#ff6b6b' }} /> {result.percentage}%
                    </div>
                  </td>
                  <td>{new Date(result.date).toLocaleString()}</td>
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