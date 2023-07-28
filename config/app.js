var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');

//Database Setup
let mongoose = require('mongoose');
let DB = require('./db')

mongoose.connect(DB.URI, { useNewUrlParser: true, useUnifiedTopology: true });

let mongoDB = mongoose.connection;
mongoDB.on('error', console.error.bind(console, 'Connection Error:'));
mongoDB.once('open', () => {
  console.log('Node.JS is successfully connected to MongoDB.')
});

// Import your Contact model (create a model for your contact information)
let Contact = require('C:/Users/LENOVO/OneDrive/Desktop/Centennial College/2nd Sem/Web App Development/Assignment 1/Express_PortFolio/models/contact'); // Adjust the path to 'contact.js' if necessary

var indexRouter = require('../routes/index');
var usersRouter = require('../routes/users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../node_modules')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


// Route to handle the form submission from the contact page
app.post('/contact', (req, res) => {
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
  .then((savedContact) => {
    console.log('Contact saved successfully:', savedContact);
    res.redirect('/');
  })
  .catch((err) => {
    console.error('Error saving contact information:', err);
    res.status(500).send('Error saving contact information');
  });
});

app.post('/updateProject/:id', (req, res) => {
  const projectId = req.params.id;
  // Here, you can access the updated project data from req.body
  const updatedProject = {
    title: req.body.projectTitle,
    description: req.body.projectDescription,
    status: projectStatus,
    // Other properties as per your data model
  };

  // Now, you can update the project information in the database using the projectId and updatedProject data
  // Add your database update logic here...

  // After updating the project, you can redirect to the displayProjects page
  res.redirect('/displayProjects');
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
