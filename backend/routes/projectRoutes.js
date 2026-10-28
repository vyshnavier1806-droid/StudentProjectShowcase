
const express = require("express");
const router = express.Router();

const {
  getProjects,
  addProject,
  getProjectById,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Protected routes: login required
router.post("/", authMiddleware, addProject);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
