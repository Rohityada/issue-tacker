const Project = require("../models/Project");

//Controller to go the Home
module.exports.home = async (req, res) => {
  try {
    // Fetch all projects
    const projects = await Project.find();

    return res.render("home", {
      title: "Home",
      projects: projects,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
};
