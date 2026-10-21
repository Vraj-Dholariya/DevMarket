// Script to fix database issues
require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

async function fixDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete projects without owners
    const result = await Project.deleteMany({ owner: null });
    console.log(`Deleted ${result.deletedCount} projects without owners`);

    // Delete projects with invalid owners
    const projects = await Project.find().populate('owner');
    let deletedInvalid = 0;
    
    for (const project of projects) {
      if (!project.owner) {
        await Project.findByIdAndDelete(project._id);
        deletedInvalid++;
      }
    }
    
    console.log(`Deleted ${deletedInvalid} projects with invalid owners`);
    console.log('Database fixed!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  }
}

fixDatabase();
