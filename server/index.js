require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schemas
const loveResultSchema = new mongoose.Schema({
  uniqueId: String,
  name1: String,
  name2: String,
  percentage: Number,
  date: { type: Date, default: Date.now },
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const LoveResult = mongoose.model("LoveResult", loveResultSchema);
const Admin = mongoose.model("Admin", adminSchema);

// Generate unique ID
function generateUniqueId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Calculate Love Percentage
function calculateLovePercentage(name1, name2) {
  const combinedNames = (name1 + name2).toLowerCase().replace(/\s/g, "");
  const uniqueLetters = [...new Set(combinedNames)];
  const basePercentage = uniqueLetters.length * 10;
  return Math.min(basePercentage + Math.floor(Math.random() * 20), 100);
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware to verify admin token
const authenticateAdmin = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.admin = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

// Routes

// Public routes
app.post("/api/calculate-love", async (req, res) => {
  try {
    const { name1, name2 } = req.body;

    if (!name1 || !name2) {
      return res.status(400).json({ error: "Both names are required" });
    }

    const percentage = calculateLovePercentage(name1, name2);
    const uniqueId = generateUniqueId();

    // Save to database
    const newResult = new LoveResult({ uniqueId, name1, name2, percentage });
    await newResult.save();

    res.json({ uniqueId, percentage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/result/:uniqueId", async (req, res) => {
  try {
    const result = await LoveResult.findOne({ uniqueId: req.params.uniqueId });
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.json({ percentage: result.percentage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Admin routes
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ username: admin.username }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/admin/results", authenticateAdmin, async (req, res) => {
  try {
    const results = await LoveResult.find().sort({ date: -1 });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete single result
app.delete("/api/admin/results/:id", authenticateAdmin, async (req, res) => {
  try {
    const result = await LoveResult.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.json({ message: "Result deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete all results
app.delete("/api/admin/results", authenticateAdmin, async (req, res) => {
  try {
    await LoveResult.deleteMany({});
    res.json({ message: "All results deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Create admin if not exists (run once)
// async function createAdmin() {
//   const adminExists = await Admin.findOne({ username: "admin" });
//   if (!adminExists) {
//     const hashedPassword = await bcrypt.hash("admin123", 10);
//     const admin = new Admin({ username: "admin", password: hashedPassword });
//     await admin.save();
//     console.log("Admin user created");
//   }
// }

// createAdmin();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
