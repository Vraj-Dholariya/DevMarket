// Script to add sample milestones to existing projects for testing
require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

const sampleMilestones = [
  { title: 'Project Planning & Requirements', completed: false },
  { title: 'Setup Development Environment', completed: false },
  { title: 'Design Database Schema', completed: false },
  { title: 'Implement Core Features', completed: false },
  { title: 'Testing & Quality Assurance', completed: false },
  { title: 'Deployment to Production', completed: false }
];

async function addMilestonesToProjects() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find projects without milestones
    const projects = await Project.find({
      $or: [
        { milestones: { $exists: false } },
        { milestones: { $size: 0 } }
      ]
    });

    console.log(`Found ${projects.length} projects without milestones`);

    for (const project of projects) {
      project.milestones = sampleMilestones;
      await project.save();
      console.log(`Added milestones to: ${project.title}`);
    }

    console.log('\n✅ Done! All projects now have sample milestones.');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addMilestonesToProjects();
