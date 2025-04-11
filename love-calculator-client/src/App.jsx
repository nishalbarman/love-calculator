import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./App.css";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import LoveCalculator from "./components/LoveCalculator";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuth(true);
    }
  }, []);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="app">
        {/* Background elements */}
        <div className="background-elements">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="floating-bg-element"
              initial={{
                x: Math.random() * 100,
                y: Math.random() * 100,
                opacity: 0,
              }}
              animate={{
                x: [null, Math.random() * 100],
                y: [null, Math.random() * 100],
                opacity: [0, 0.5, 0],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
        </div>
        <Routes>
          <Route path="/" element={<LoveCalculator />} />
          <Route
            path="/admin/login"
            element={
              isAuth ? (
                <Navigate to="/admin" />
              ) : (
                <AdminLogin setAuth={setIsAuth} />
              )
            }
          />
          <Route
            path="/admin"
            element={isAuth ? <AdminPanel /> : <Navigate to="/admin/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
