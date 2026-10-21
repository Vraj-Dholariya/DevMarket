const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');
const Bookmark = require('../models/Bookmark');
const { isAuthenticated } = require('../middleware/auth');
const { calculateSkillMatch, calculateReadinessScore } = require('../utils/skillMatch');

// Browse all projects
router.get('/projects', async (req, res) => {
  try {
    const { search, category, difficulty, technology } = req.query;
    
    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { technologies: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    
    if (technology) {
      query.technologies = { $in: [new RegExp(technology, 'i')] };
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    // Get user's bookmarks if logged in
    let bookmarkedProjectIds = [];
    if (req.session.userId) {
      const bookmarks = await Bookmark.find({ user: req.session.userId });
      bookmarkedProjectIds = bookmarks.map(b => b.project.toString());
    }

    res.render('projects', {
      title: 'Browse Projects',
      projects,
      bookmarkedProjectIds,
      filters: { search, category, difficulty, technology }
    });
  } catch (error) {
    console.error('Browse projects error:', error);
    req.flash('error', 'Could not load projects');
    res.redirect('/');
  }
});

// Show project details
router.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email skills')
      .populate('teamMembers', 'name email skills');

    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/projects');
    }

    // Increment view count
    project.viewCount += 1;
    await project.save();

    // Calculate skill match if user is logged in
    let skillMatch = null;
    let isBookmarked = false;
    let hasRequested = false;

    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      skillMatch = calculateSkillMatch(user.skills, project.requiredSkills);
      
      // Check if bookmarked
      const bookmark = await Bookmark.findOne({
        user: req.session.userId,
        project: project._id
      });
      isBookmarked = !!bookmark;

      // Check if already requested
      const JoinRequest = require('../models/JoinRequest');
      const request = await JoinRequest.findOne({
        user: req.session.userId,
        project: project._id
      });
      hasRequested = !!request;
    }

    // Calculate readiness score
    const readinessScore = calculateReadinessScore(project);

    res.render('project-details', {
      title: project.title,
      project,
      skillMatch,
      isBookmarked,
      hasRequested,
      readinessScore
    });
  } catch (error) {
    console.error('Project details error:', error);
    req.flash('error', 'Could not load project');
    res.redirect('/projects');
  }
});

// Show create project page
router.get('/projects/create/new', isAuthenticated, (req, res) => {
  res.render('create-project', { title: 'Create Project' });
});

// Handle create project
router.post('/projects', isAuthenticated, async (req, res) => {
  try {
    const { title, description, category, difficulty, technologies, requiredSkills, maxTeamSize, milestones } = req.body;

    // Validate required fields
    if (!title || !description || !category || !difficulty) {
      req.flash('error', 'Please fill in all required fields');
      return res.redirect('/projects/create/new');
    }

    // Parse arrays from comma-separated strings
    const techArray = technologies ? technologies.split(',').map(t => t.trim()).filter(t => t) : [];
    const skillsArray = requiredSkills ? requiredSkills.split(',').map(s => s.trim()).filter(s => s) : [];
    
    // Parse milestones array
    let milestonesArray = [];
    if (milestones) {
      const milestonesInput = Array.isArray(milestones) ? milestones : [milestones];
      milestonesArray = milestonesInput
        .filter(m => m && m.trim())
        .map(m => ({
          title: m.trim(),
          completed: false
        }));
    }

    // Create project
    const project = new Project({
      title,
      description,
      category,
      difficulty,
      technologies: techArray,
      requiredSkills: skillsArray,
      maxTeamSize: maxTeamSize || 5,
      milestones: milestonesArray,
      owner: req.session.userId
    });

    await project.save();

    req.flash('success', 'Project created successfully!');
    res.redirect(`/projects/${project._id}`);
  } catch (error) {
    console.error('Create project error:', error);
    req.flash('error', 'Could not create project');
    res.redirect('/projects/create/new');
  }
});

// Show edit project page
router.get('/projects/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/my-projects');
    }

    // Check ownership
    if (project.owner.toString() !== req.session.userId) {
      req.flash('error', 'You can only edit your own projects');
      return res.redirect('/my-projects');
    }

    res.render('edit-project', { title: 'Edit Project', project });
  } catch (error) {
    console.error('Edit project page error:', error);
    req.flash('error', 'Could not load project');
    res.redirect('/my-projects');
  }
});

// Handle update project
router.post('/projects/:id', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/my-projects');
    }

    // Check ownership
    if (project.owner.toString() !== req.session.userId) {
      req.flash('error', 'You can only edit your own projects');
      return res.redirect('/my-projects');
    }

    const { title, description, category, difficulty, technologies, requiredSkills, maxTeamSize, status, milestones } = req.body;

    // Parse arrays
    const techArray = technologies ? technologies.split(',').map(t => t.trim()).filter(t => t) : [];
    const skillsArray = requiredSkills ? requiredSkills.split(',').map(s => s.trim()).filter(s => s) : [];
    
    // Parse milestones array - preserve completion status for existing milestones
    let milestonesArray = [];
    if (milestones) {
      const milestonesInput = Array.isArray(milestones) ? milestones : [milestones];
      milestonesArray = milestonesInput
        .filter(m => m && m.trim())
        .map((m, index) => {
          // Try to match with existing milestone to preserve completed status
          const existingMilestone = project.milestones[index];
          return {
            title: m.trim(),
            completed: existingMilestone && existingMilestone.title === m.trim() 
              ? existingMilestone.completed 
              : false
          };
        });
    }

    // Update project
    project.title = title;
    project.description = description;
    project.category = category;
    project.difficulty = difficulty;
    project.technologies = techArray;
    project.requiredSkills = skillsArray;
    project.maxTeamSize = maxTeamSize || 5;
    project.milestones = milestonesArray;
    if (status) project.status = status;

    await project.save();

    req.flash('success', 'Project updated successfully!');
    res.redirect(`/projects/${project._id}`);
  } catch (error) {
    console.error('Update project error:', error);
    req.flash('error', 'Could not update project');
    res.redirect(`/projects/${req.params.id}/edit`);
  }
});

// Delete project
router.post('/projects/:id/delete', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/my-projects');
    }

    // Check ownership
    if (project.owner.toString() !== req.session.userId) {
      req.flash('error', 'You can only delete your own projects');
      return res.redirect('/my-projects');
    }

    // Delete related bookmarks and join requests
    await Bookmark.deleteMany({ project: project._id });
    
    const JoinRequest = require('../models/JoinRequest');
    await JoinRequest.deleteMany({ project: project._id });

    await Project.findByIdAndDelete(req.params.id);

    req.flash('success', 'Project deleted successfully');
    res.redirect('/my-projects');
  } catch (error) {
    console.error('Delete project error:', error);
    req.flash('error', 'Could not delete project');
    res.redirect('/my-projects');
  }
});

// Show project progress page
router.get('/projects/:id/progress', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name')
      .populate('teamMembers', 'name');

    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/projects');
    }

    // Check if user is owner or team member
    const isOwner = project.owner._id.toString() === req.session.userId;
    const isTeamMember = project.teamMembers.some(member => member._id.toString() === req.session.userId);

    if (!isOwner && !isTeamMember) {
      req.flash('error', 'Access denied');
      return res.redirect(`/projects/${project._id}`);
    }

    // Calculate progress
    const totalMilestones = project.milestones.length;
    const completedMilestones = project.milestones.filter(m => m.completed).length;
    const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

    res.render('project-progress', {
      title: `${project.title} - Progress`,
      project,
      isOwner,
      progressPercentage
    });
  } catch (error) {
    console.error('Project progress error:', error);
    req.flash('error', 'Could not load project progress');
    res.redirect('/projects');
  }
});

// Add milestone
router.post('/projects/:id/milestones', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check ownership
    if (project.owner.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Milestone title is required' });
    }

    project.milestones.push({ title, completed: false });
    await project.save();

    res.json({ success: true, milestone: project.milestones[project.milestones.length - 1] });
  } catch (error) {
    console.error('Add milestone error:', error);
    res.status(500).json({ error: 'Could not add milestone' });
  }
});

// Toggle milestone completion
router.post('/projects/:id/milestones/:milestoneId/toggle', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is owner or team member
    const isOwner = project.owner.toString() === req.session.userId;
    const isTeamMember = project.teamMembers.some(member => member.toString() === req.session.userId);

    if (!isOwner && !isTeamMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const milestone = project.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ error: 'Milestone not found' });
    }

    milestone.completed = !milestone.completed;
    await project.save();

    res.json({ success: true, completed: milestone.completed });
  } catch (error) {
    console.error('Toggle milestone error:', error);
    res.status(500).json({ error: 'Could not update milestone' });
  }
});

module.exports = router;
