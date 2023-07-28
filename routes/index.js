var express = require('express');
var router = express.Router();

const Contact = require('../models/contact');
const Project = require('../models/project');



/* GET home page. */
router.get('/', function(req, res, next) {
  const ms = "My mission is creating and sharing my expertise with innovation, imagination and originality"
  res.render('index', { title: 'My Express Portfolio', missionStatement: ms });
});

/* GET about page. */
router.get('/About', function(req, res, next) {
  res.render('About', { title: 'About Me' });
});

/* GET contact page. */
router.get('/Contact', function(req, res, next) {
  res.render('Contact', { title: 'Contact' });
});

/* POST contact form submission. */
router.post('/contact', function(req, res) {
  // Get data from the form submission
  const { firstName, lastName, contactNumber, email, message } = req.body;

  // Create a new Contact instance with the form data
  const newContact = new Contact({
    firstName,
    lastName,
    contactNumber,
    email,
    message
  });

  // Save the new contact information to the database
  newContact.save()
    .then(() => {
      console.log('Contact Information saved successfully.');
      // Redirect back to the home page after saving the data
      res.redirect('/');
    })
    .catch((err) => {
      console.error('Error saving contact information:', err);
      // You can handle the error and show an error page or message if needed
      res.status(500).send('Error saving contact information');
    });
});

/* GET project page. */


router.get('/project', function(req, res, next) {
  // Fetch all projects from the database
  Project.find({}, function(err, projects) {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).send('Error fetching projects');
    }

    // Render the Projects view and pass the fetched projects data
    res.render('Projects', { title: 'Project', projects: projects });
  });
});

// Route to render the form for adding a new project
router.get('/addProject', function(req, res) {
  res.render('addProject', { title: 'Add Project' });
});

// Route to handle the form submission for adding a new project
router.post('/addProject', async (req, res) => {
  try {
    const { projectTitle, projectDescription, projectStatus } = req.body;

    // Create a new project using the Project model
    const newProject = new Project({
      title: projectTitle,
      description: projectDescription,
      status: projectStatus,
    });

    // Save the new project to the database
    await newProject.save();

    // Redirect back to the projects page after adding the project
    res.redirect('/projects');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to fetch all projects and render the displayProjects page
router.get('/displayProjects', function (req, res, next) {
  // Fetch all projects from the database
  Project.find({}, function (err, projects) {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).send('Error fetching projects');
    }

    // Separate finished and ongoing projects based on their status
    const finishedProjects = projects.filter((project) => project.status === 'finished');
    const ongoingProjects = projects.filter((project) => project.status === 'ongoing');

    // Render the displayProjects view and pass the filtered project data and the title variable
    res.render('displayProjects', { title: 'Display Projects', finishedProjects, ongoingProjects });
  });
});

// Handle update project form submission
router.post('/updateProject/:id', async (req, res) => {
  const projectId = req.params.id;
  const { projectTitle, projectDescription, projectStatus } = req.body;
  
  try {
    // Find the project by ID and update its information
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      {
        title: projectTitle,
        description: projectDescription,
        status: projectStatus,
      },
      { new: true }
    );
    res.redirect('/displayProjects');
  } catch (err) {
    console.error('Error updating project:', err);
    res.sendStatus(500);
  }
});

// Handle delete project request
router.delete('/deleteProject/:id', async (req, res) => {
  const projectId = req.params.id;

  try {
    // Find the project by ID and delete it
    await Project.findByIdAndRemove(projectId);
    res.sendStatus(200);
  } catch (err) {
    console.error('Error deleting project:', err);
    res.sendStatus(500);
  }
});

/* GET service page. */
router.get('/service', function(req, res, next) {
  res.render('services', { title: 'Service' });
});

module.exports = router;
