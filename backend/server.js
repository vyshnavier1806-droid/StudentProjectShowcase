
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// Middleware
app.use(cors());

// Allow Base64 cover images in JSON requests
app.use(express.json({ limit: "10mb" }));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Student Project Showcase API is running!");
});

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    message: "API routes are working!"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log("Projects route: /api/projects");
      console.log("Auth route: /api/auth");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
