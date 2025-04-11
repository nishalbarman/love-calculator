import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHeart,
  FaArrowRight,
  FaStar,
  FaFire,
  FaLaugh,
  FaHandsHelping,
} from "react-icons/fa";
import "./LoveCalculator.css";

const LoveCalculator = () => {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateLove = async (e) => {
    e.preventDefault();
    if (!name1 || !name2) {
      setError("Both names are required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `https://love-calculator-i7d3.onrender.com/api/calculate-love`,
        {
          name1,
          name2,
        }
      );

      // Generate additional metrics
      const enhancedResult = {
        ...response.data,
        compatibility: generateCompatibility(response.data.percentage),
        strengths: generateStrengths(name1, name2, response.data.percentage),
        advice: generateAdvice(response.data.percentage),
        funMetrics: generateFunMetrics(name1, name2),
      };

      setResult(enhancedResult);
      localStorage.setItem("loveResultId", response.data.uniqueId);
    } catch (error) {
      console.error("Error calculating love:", error);
      setError("Failed to calculate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate compatibility description
  const generateCompatibility = (percentage) => {
    if (percentage < 30) return "Low compatibility";
    if (percentage < 50) return "Moderate compatibility";
    if (percentage < 70) return "Good compatibility";
    if (percentage < 90) return "Excellent compatibility";
    return "Perfect compatibility";
  };

  // Generate relationship strengths
  const generateStrengths = (name1, name2, percentage) => {
    const strengths = [];
    const combinedLength = (name1.length + name2.length) / 2;

    if (percentage > 70) strengths.push("Strong emotional connection");
    if (percentage > 50) strengths.push("Good communication potential");
    if (combinedLength > 10) strengths.push("Complementary personalities");
    if (percentage > 30) strengths.push("Shared values foundation");
    if (name1.length === name2.length) strengths.push("Balanced relationship");

    return strengths.length > 0 ? strengths : ["Potential for growth"];
  };

  // Generate relationship advice
  const generateAdvice = (percentage) => {
    if (percentage < 30)
      return "Take things slow and focus on building friendship first.";
    if (percentage < 50)
      return "Look for common interests to strengthen your connection.";
    if (percentage < 70)
      return "Nurture your bond with quality time and open communication.";
    if (percentage < 90)
      return "Keep doing what you're doing - your relationship is strong!";
    return "You've found something special - cherish and protect your bond!";
  };

  // Generate fun metrics
  const generateFunMetrics = (name1, name2) => {
    const vowels1 = (name1.match(/[aeiou]/gi) || []).length;
    const vowels2 = (name2.match(/[aeiou]/gi) || []).length;
    const totalLetters = name1.length + name2.length;

    return {
      romanceScore: Math.min(
        100,
        Math.floor(((vowels1 + vowels2) / totalLetters) * 200)
      ),
      passionScore: Math.min(100, Math.floor(Math.random() * 30) + 50),
      friendshipScore: Math.min(
        100,
        100 - Math.abs(name1.length - name2.length) * 5
      ),
      longevityScore: Math.min(100, Math.floor(totalLetters * 3)),
    };
  };

  const getHeartColor = (percentage) => {
    if (percentage < 30) return "#ff6b6b";
    if (percentage < 50) return "#ffa3a3";
    if (percentage < 70) return "#ff7676";
    if (percentage < 90) return "#ff5252";
    return "#ff0000";
  };

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <h1 className="title">
        <FaHeart className="heart-icon mr-2" />
        <span className="font-bold text-2xl">Love Calculator</span>
        <FaHeart className="heart-icon ml-2" />
      </h1>

      <form onSubmit={calculateLove} className="love-form">
        <div className="input-group">
          <input
            type="text"
            placeholder="Your name"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            className="name-input"
          />
          <FaHeart className="form-heart-icon" />
          <input
            type="text"
            placeholder="Crush name"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            className="name-input"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <motion.button
          type="submit"
          className="calculate-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}>
          {loading ? "Calculating..." : "Calculate Love"}
          <FaArrowRight className="button-icon" />
        </motion.button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div
            className="result-container p- md:p-2 mt-2 container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}>
            <h2>Love Compatibility Report</h2>
            <div className="result-id"></div>
            {/* <div className="result-id">Result ID: {result.uniqueId}</div> */}

            {/* Main percentage circle */}
            <div className="main-result">
              <motion.div
                className="percentage-circle"
                style={{
                  background: `conic-gradient(${getHeartColor(
                    result.percentage
                  )} ${result.percentage * 3.6}deg, #f3f3f3 0deg)`,
                }}
                initial={{ rotate: -90, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}>
                <div className="percentage-value">{result.percentage}%</div>
              </motion.div>
              <div className="compatibility-text">
                <h3>{result.compatibility}</h3>
                <p>{result.advice}</p>
              </div>
            </div>

            {/* Relationship strengths */}
            <div className="strengths-section">
              <h3>
                <FaStar className="section-icon" /> Relationship Strengths
              </h3>
              <ul className="strengths-list">
                {result.strengths.map((strength, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}>
                    {strength}
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Fun metrics */}
            <div className="metrics-section">
              <h3>
                <FaFire className="section-icon" /> Relationship Metrics
              </h3>
              <div className="metrics-grid">
                <div className="metric">
                  <div className="metric-label">Romance</div>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{
                        width: `${result.funMetrics.romanceScore}%`,
                      }}></div>
                  </div>
                  <div className="metric-value">
                    {result.funMetrics.romanceScore}%
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-label">Passion</div>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{
                        width: `${result.funMetrics.passionScore}%`,
                      }}></div>
                  </div>
                  <div className="metric-value">
                    {result.funMetrics.passionScore}%
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-label">Friendship</div>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{
                        width: `${result.funMetrics.friendshipScore}%`,
                      }}></div>
                  </div>
                  <div className="metric-value">
                    {result.funMetrics.friendshipScore}%
                  </div>
                </div>
                <div className="metric">
                  <div className="metric-label">Longevity</div>
                  <div className="metric-bar">
                    <div
                      className="metric-fill"
                      style={{
                        width: `${result.funMetrics.longevityScore}%`,
                      }}></div>
                  </div>
                  <div className="metric-value">
                    {result.funMetrics.longevityScore}%
                  </div>
                </div>
              </div>
            </div>

            {/* Additional advice */}
            <div className="advice-section">
              <h3>
                <FaLaugh className="section-icon" /> Fun Fact
              </h3>
              <p>
                Your names have {name1.length + name2.length} letters combined.{" "}
                {name1.length === name2.length
                  ? "What perfect balance!"
                  : "The difference in length suggests interesting dynamics!"}
              </p>
            </div>

            {/* Hearts animation */}
            <motion.div
              className="hearts-animation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}>
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="floating-heart"
                  style={{ color: getHeartColor(result.percentage) }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    delay: 0.8 + i * 0.1,
                    duration: 2,
                    repeat: Infinity,
                  }}>
                  <FaHeart />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default LoveCalculator;
