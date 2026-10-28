
import { useState, useEffect } from "react";
import "./App.css";
import Auth from "./Auth.jsx";

const API_URL = "http://localhost:5000/api/projects";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80";

const emptyForm = {
  title: "",
  description: "",
  category: "Web Development",
  technologies: "",
  image: "",
  githubLink: "",
  demoLink: ""
};

function getProjectImage(project) {
  if (project.image) return project.image;

  const technologies = Array.isArray(project.technologies)
    ? project.technologies.join(" ")
    : project.technologies || "";

  const text = `${project.title || ""} ${project.category || ""} ${
    project.description || ""
  } ${technologies}`.toLowerCase();

  if (/food|restaurant|recipe|foodorax/.test(text)) {
    return "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80";
  }

  if (/artificial intelligence|machine learning|educational assistant|generative ai/.test(text)) {
    return "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80";
  }

  if (/cybersecurity|secure|security|password/.test(text)) {
    return "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=900&q=80";
  }

  if (/attendance|student|classroom|education/.test(text)) {
    return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80";
  }

  if (/budget|expense|finance|money/.test(text)) {
    return "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80";
  }

  if (/travel|tourism|trip/.test(text)) {
    return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=80";
  }

  if (/book|library|reading/.test(text)) {
    return "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=80";
  }

  if (/weather|climate/.test(text)) {
    return "https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=900&q=80";
  }

  if (/yoga|fitness|health/.test(text)) {
    return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=900&q=80";
  }

  return FALLBACK_IMAGE;
}

function getOwnerId(project) {
  if (!project?.owner) return "";

  return typeof project.owner === "object"
    ? String(project.owner._id || project.owner.id || "")
    : String(project.owner);
}

function getProjectId(project) {
  return String(project?._id || project?.id || "");
}

function uniqueProjects(data) {
  if (!Array.isArray(data)) return [];

  const seen = new Set();

  return data.filter((project) => {
    const id = getProjectId(project);

    // Exclude records without a usable ID and duplicate IDs.
    if (!id || seen.has(id)) return false;

    seen.add(id);
    return true;
  });
}

export default function App() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Projects");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("showcaseUser")) || null;
    } catch {
      return null;
    }
  });

  const categories = [
    "All Projects",
    "Web Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Cybersecurity",
    "Mobile Application",
    "Other"
  ];

  useEffect(() => {
    const controller = new AbortController();

    async function initialLoad() {
      try {
        const response = await fetch(API_URL, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Unable to load projects");
        }

        const data = await response.json();
        setProjects(uniqueProjects(data));
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            "Cannot connect to the backend. Make sure the server is running on port 5000."
          );
        }
      }
    }

    initialLoad();

    return () => controller.abort();
  }, []);

  async function loadProjects() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load projects");
      }

      const data = await response.json();
      const cleanedProjects = uniqueProjects(data);

      setProjects(cleanedProjects);

      // Keep the opened project details in sync with refreshed data.
      setSelectedProject((previous) => {
        if (!previous) return null;

        return (
          cleanedProjects.find(
            (project) => getProjectId(project) === getProjectId(previous)
          ) || null
        );
      });

      setError("");
    } catch {
      setError(
        "Cannot connect to the backend. Make sure the server is running on port 5000."
      );
    }
  }

  function handleLogin(data) {
    localStorage.setItem("showcaseUser", JSON.stringify(data.user));
    localStorage.setItem("showcaseToken", data.token);
    setUser(data.user);
    setShowAuth(false);
    setMessage("Logged in successfully!");
    setError("");
  }

  function handleLogout() {
    localStorage.removeItem("showcaseUser");
    localStorage.removeItem("showcaseToken");
    setUser(null);
    setMessage("You have logged out.");
    setError("");
  }

  function openAddForm() {
    if (!user || !localStorage.getItem("showcaseToken")) {
      setShowAuth(true);
      return;
    }

    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
    setMessage("");
    setError("");

    document.getElementById("projects")?.scrollIntoView({
      behavior: "smooth"
    });
  }

  function handleInputChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("Please choose an image smaller than 3 MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((previous) => ({
        ...previous,
        image: reader.result
      }));
      setError("");
    };

    reader.onerror = () => {
      setError("Unable to read this image. Please try another file.");
    };

    reader.readAsDataURL(file);
  }

  function removeImage() {
    setForm((previous) => ({
      ...previous,
      image: ""
    }));

    const fileInput = document.getElementById("image");
    if (fileInput) fileInput.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    const token = localStorage.getItem("showcaseToken");

    if (!user || !token) {
      setShowAuth(true);
      return;
    }

    setLoading(true);

    const projectData = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      technologies: form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    };

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(projectData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save project");
      }

      setMessage(
        editingId
          ? "Project updated successfully!"
          : "Project submitted successfully!"
      );

      setForm({ ...emptyForm });
      setEditingId(null);
      setShowForm(false);

      const fileInput = document.getElementById("image");
      if (fileInput) fileInput.value = "";

      await loadProjects();
    } catch (err) {
      setError(err.message || "Unable to save project");
    } finally {
      setLoading(false);
    }
  }

  function startEditing(project) {
    if (!user) {
      setShowAuth(true);
      return;
    }

    setForm({
      title: project.title || "",
      description: project.description || "",
      category: project.category || "Web Development",
      technologies: Array.isArray(project.technologies)
        ? project.technologies.join(", ")
        : project.technologies || "",
      image: project.image || "",
      githubLink: project.githubLink || "",
      demoLink: project.demoLink || ""
    });

    setEditingId(getProjectId(project));
    setSelectedProject(null);
    setShowForm(true);
    setMessage("");
    setError("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteProject(project) {
    if (!window.confirm(`Delete "${project.title}"?`)) return;

    const token = localStorage.getItem("showcaseToken");

    if (!token) {
      setShowAuth(true);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${getProjectId(project)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete project");
      }

      setProjects((previous) =>
        previous.filter(
          (item) => getProjectId(item) !== getProjectId(project)
        )
      );

      setSelectedProject(null);
      setMessage("Project deleted successfully!");
      setError("");
    } catch (err) {
      setError(err.message || "Unable to delete project");
    }
  }

  function isProjectOwner(project) {
    if (!user) return false;

    return getOwnerId(project) === String(user.id || user._id || "");
  }

  const query = search.trim().toLowerCase();

  const filteredProjects = projects.filter((project) => {
    const technologies = Array.isArray(project.technologies)
      ? project.technologies
      : typeof project.technologies === "string"
        ? project.technologies.split(",")
        : [];

    const matchesSearch =
      (project.title || "").toLowerCase().includes(query) ||
      (project.description || "").toLowerCase().includes(query) ||
      (project.author || "").toLowerCase().includes(query) ||
      technologies.some((item) =>
        String(item).toLowerCase().includes(query)
      );

    const matchesCategory =
      selectedCategory === "All Projects" ||
      project.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app">
      <nav className="navbar">
        <a href="#home" className="logo">
          ProjectHub
        </a>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#projects">Projects</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="welcome-user">Hi, {user.name}</span>
              <button className="nav-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <button className="nav-button" onClick={() => setShowAuth(true)}>
              Login / Register
            </button>
          )}

          <button className="nav-button" onClick={openAddForm}>
            Submit Project
          </button>
        </div>
      </nav>

      <header className="hero" id="home">
        <div className="hero-content">
          <span className="hero-tag">STUDENT INNOVATION</span>
          <h1>
            Discover Ideas.
            <br />
            <span>Showcase Your Projects.</span>
          </h1>
          <p>
            Explore creative student projects, share your work, and discover
            innovative ideas from fellow students.
          </p>
          <a href="#projects" className="hero-button">
            Explore Projects
          </a>
        </div>
      </header>

      <main>
        <section className="projects-section" id="projects">
          <div className="section-heading">
            <div>
              <span className="section-tag">OUR COMMUNITY</span>
              <h2>Explore Student Projects</h2>
              <p>Find ideas and get inspired by student innovation.</p>
            </div>
          </div>

          {message && <p className="status-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="project-tools">
            <input
              className="search-input"
              type="search"
              placeholder="Search projects, technologies, or students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={
                    selectedCategory === category
                      ? "category-filter active"
                      : "category-filter"
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {showForm && (
            <div className="submission-form">
              <h2>{editingId ? "Edit Your Project" : "Submit a Project"}</h2>

              <form onSubmit={handleSubmit}>
                <label htmlFor="title">Project Title</label>
                <input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  required
                />

                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={form.description}
                  onChange={handleInputChange}
                  required
                />

                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  required
                >
                  {categories
                    .filter((item) => item !== "All Projects")
                    .map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>

                <label htmlFor="technologies">
                  Technologies (comma-separated)
                </label>
                <input
                  id="technologies"
                  name="technologies"
                  value={form.technologies}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB"
                />

                <label htmlFor="image">Project Cover Image (optional)</label>
                <input
                  id="image"
                  name="imageFile"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <small className="upload-help">
                  Choose an image from your computer. Maximum size: 3 MB.
                  If you do not select one, a topic-related image will be shown.
                </small>

                {form.image && (
                  <div className="image-preview">
                    <p>Cover image preview</p>
                    <img src={form.image} alt="Selected project cover preview" />
                    <button
                      type="button"
                      className="remove-image-button"
                      onClick={removeImage}
                    >
                      Remove image
                    </button>
                  </div>
                )}

                <label htmlFor="githubLink">GitHub Link (optional)</label>
                <input
                  id="githubLink"
                  name="githubLink"
                  type="url"
                  value={form.githubLink}
                  onChange={handleInputChange}
                />

                <label htmlFor="demoLink">Live Demo Link (optional)</label>
                <input
                  id="demoLink"
                  name="demoLink"
                  type="url"
                  value={form.demoLink}
                  onChange={handleInputChange}
                />

                <div className="form-actions">
                  <button type="submit" disabled={loading}>
                    {loading
                      ? "Saving..."
                      : editingId
                        ? "Update Project"
                        : "Submit Project"}
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm({ ...emptyForm });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="project-grid">
            {filteredProjects.map((project) => (
              <article
                className="project-card"
                key={getProjectId(project)}
              >
                <div className="project-image">
                  <img
                    src={getProjectImage(project)}
                    alt={`${project.title || "Student"} project`}
                    loading="eager"
                    onError={(e) => {
                      if (e.currentTarget.src !== FALLBACK_IMAGE) {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMAGE;
                      }
                    }}
                  />
                  <span className="category-badge">{project.category}</span>
                </div>

                <div className="project-card-content">
                  <div className="project-author">
                    <span className="author-avatar">
                      {(project.author || "S").charAt(0).toUpperCase()}
                    </span>
                    <span>{project.author || "Student"}</span>
                  </div>

                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  <div className="technology-list">
                    {(Array.isArray(project.technologies)
                      ? project.technologies
                      : []
                    ).map((technology, index) => (
                      <span key={`${technology}-${index}`}>{technology}</span>
                    ))}
                  </div>

                  <div className="project-card-footer">
                    <button
                      className="view-button"
                      onClick={() => setSelectedProject(project)}
                    >
                      View Project <span>↗</span>
                    </button>
                  </div>

                  {isProjectOwner(project) && (
                    <div className="owner-actions">
                      <button
                        className="edit-button"
                        onClick={() => startEditing(project)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => deleteProject(project)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="empty-state">
              <h3>No projects found</h3>
              <p>
                Try another search or category, or submit a new project.
              </p>
              <button className="nav-button" onClick={openAddForm}>
                Submit a Project
              </button>
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <span className="section-tag">ABOUT PROJECTHUB</span>
          <h2>A Place for Student Creativity</h2>
          <p>
            ProjectHub helps students present their academic and personal
            projects in one place. Discover ideas, explore technologies,
            and share what you have built.
          </p>
        </section>
      </main>

      <footer>
        <p>
          © {new Date().getFullYear()} ProjectHub — Student Project Showcase
        </p>
      </footer>

      {selectedProject && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="project-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close project details"
            >
              ×
            </button>

            <img
              className="modal-project-image"
              src={getProjectImage(selectedProject)}
              alt={selectedProject.title}
              onError={(e) => {
                if (e.currentTarget.src !== FALLBACK_IMAGE) {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMAGE;
                }
              }}
            />

            <span className="category-badge">{selectedProject.category}</span>
            <h2>{selectedProject.title}</h2>
            <p>{selectedProject.description}</p>
            <p>
              <strong>Created by:</strong>{" "}
              {selectedProject.author || "Student"}
            </p>

            <h3>Technologies Used</h3>

            <div className="technology-list">
              {(Array.isArray(selectedProject.technologies)
                ? selectedProject.technologies
                : []
              ).map((technology, index) => (
                <span key={`${technology}-${index}`}>{technology}</span>
              ))}
            </div>

            <div className="modal-links">
              {selectedProject.githubLink && (
                <a
                  href={selectedProject.githubLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  View GitHub
                </a>
              )}

              {selectedProject.demoLink && (
                <a
                  href={selectedProject.demoLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Demo
                </a>
              )}
            </div>

            {isProjectOwner(selectedProject) && (
              <div className="owner-actions">
                <button
                  className="edit-button"
                  onClick={() => startEditing(selectedProject)}
                >
                  Edit Project
                </button>
                <button
                  className="delete-button"
                  onClick={() => deleteProject(selectedProject)}
                >
                  Delete Project
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {showAuth && (
        <Auth
          onLogin={handleLogin}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}
