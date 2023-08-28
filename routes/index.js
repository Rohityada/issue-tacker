// Routes
const express = require("express");
const router = express.Router();

// Accessing the Controllers
const homeController = require("../controllers/home_controller");
const projectController = require("../controllers/project_controller");
const issueController = require("../controllers/issue_controller");

// Accessing the Routes
router.get("/", homeController.home);

// Route to handle project Form rendering
router.get("/project/create", projectController.projectForm);

// Route to handle project creation
router.post("/project/create", projectController.createProjects);

// Route to handle view project
router.get("/project/:id", projectController.viewProjects);

// Route to Filter the issues and search
router.get("/projects/:id/filter", projectController.filterProjects);

// Route to handle project deletion
router.post("/projects/:id/delete", projectController.deleteProject);

// Route to render the issue creation form
router.get("/projects/:id/issues/new", issueController.createIssueForm);

// Route to handle the creation of a new issue
router.post("/projects/:id/issues", issueController.createIssue);

module.exports = router;
