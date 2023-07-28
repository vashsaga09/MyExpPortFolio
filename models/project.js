const mongoose = require('mongoose');

// Define the schema for the Project model
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['finished', 'ongoing'],
    required: true,
  },
  // Add other fields as needed for your projects
  // For example: deadline, imageURL, etc.
});

// Create the Project model using the schema
const Project = mongoose.model('Project', projectSchema);

// Export the Project model
module.exports = Project;