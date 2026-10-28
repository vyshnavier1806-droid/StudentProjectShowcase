
const Project = require("../models/Project");
const User = require("../models/User");

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a project
exports.addProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      technologies,
      image,
      githubLink,
      demoLink
    } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        message: "Title, description and category are required"
      });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Please log in to submit a project"
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found. Please log in again."
      });
    }

    const project = await Project.create({
      title: title.trim(),
      description,
      category,
      technologies: Array.isArray(technologies)
        ? technologies
        : typeof technologies === "string"
          ? technologies.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
      author: user.name,
      owner: user._id,

      // Cover image: URL or Base64 data URL
      image: image || "",

      githubLink: githubLink || "",
      demoLink: demoLink || ""
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Get a single project
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({
      message: "Invalid project ID"
    });
  }
};

// Edit your own project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (
      !req.user ||
      !project.owner ||
      project.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only edit your own projects"
      });
    }

    const {
      title,
      description,
      category,
      technologies,
      image,
      githubLink,
      demoLink
    } = req.body;

    if (title !== undefined) {
      if (!title.trim()) {
        return res.status(400).json({
          message: "Project title cannot be empty"
        });
      }
      project.title = title.trim();
    }

    if (description !== undefined) {
      project.description = description;
    }

    if (category !== undefined) {
      project.category = category;
    }

    if (technologies !== undefined) {
      project.technologies = Array.isArray(technologies)
        ? technologies
        : typeof technologies === "string"
          ? technologies.split(",").map((item) => item.trim()).filter(Boolean)
          : [];
    }

    // An empty image string removes the existing cover image
    if (image !== undefined) {
      project.image = image || "";
    }

    if (githubLink !== undefined) {
      project.githubLink = githubLink;
    }

    if (demoLink !== undefined) {
      project.demoLink = demoLink;
    }

    await project.save();

    res.json({
      message: "Project updated successfully",
      project
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

// Delete your own project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (
      !req.user ||
      !project.owner ||
      project.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "You can only delete your own projects"
      });
    }

    await project.deleteOne();

    res.json({
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};
