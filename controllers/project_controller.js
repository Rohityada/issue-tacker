const Project = require("../models/Project");
const Issue = require("../models/Issue");

//To go to the form page to create project
module.exports.projectForm = async (req, res) => {
  try {
    res.render("create_project", { title: "Create Project" });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Controller to create a project
module.exports.createProjects = async (req, res) => {
  try {
    const { name, author, description } = req.body;
    const project = await Project.create({
      name,
      author,
      description,
    });

    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Controller To view project
module.exports.viewProjects = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate("issues");
    if (!project) {
      // If project is not found, handle the error
      return res.status(404).send("Project not found");
    }

    // Retrieve all labels from the project's issues
    const labels = project.issues.reduce((acc, issue) => {
      acc.push(...issue.labels);
      return acc;
    }, []);

    // Remove duplicate labels
    const uniqueLabels = [...new Set(labels)];

    return res.render("view_project", {
      title: "View Project",
      project: project,
      labels: uniqueLabels,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Controller to delete a project and its associated issues
module.exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the project by its ID
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      // If project is not found, handle the error
      return res.status(404).send("Project not found");
    }

    // Delete all issues associated with the project
    await Issue.deleteMany({ _id: { $in: project.issues } });

    // Redirect to the home page
    return res.redirect("/");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};

// Controller to handle project filter and search
module.exports.filterProjects = async (req, res) => {
  try {
    const { id } = req.params;
    const { label, search, author } = req.query;

    const project = await Project.findById(id).populate({
      path: "issues",
      match: {
        $and: [
          { labels: label === "all" ? { $exists: true } : label },
          { title: { $regex: new RegExp(search, "i") } },
          { author: { $regex: new RegExp(author, "i") } },
        ],
      },
    });

    if (!project) {
      // If project is not found, handle the error
      return res.status(404).send("Project not found");
    }

    // Filter the unique labels for the filter dropdown
    const labels = [
      ...new Set(project.issues.map((issue) => issue.labels).flat()),
    ];
    // Assign filtered issues to the variable
    const filteredIssues = project.issues;

    return res.render("view_project_filtered", {
      title: "Filtered Project",
      project: project,
      filteredIssues: filteredIssues,
      labels: labels,
      filter: label,
      search: search,
      author: author,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
