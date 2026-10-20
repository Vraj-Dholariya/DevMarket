const express = require('express');
const router = express.Router();
const JoinRequest = require('../models/JoinRequest');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { isAuthenticated } = require('../middleware/auth');

// Send join request
router.post('/projects/:id/join', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('owner', 'name');

    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/projects');
    }

    // Check if user is the project owner
    if (project.owner._id.toString() === req.session.userId) {
      req.flash('error', 'You cannot join your own project');
      return res.redirect(`/projects/${project._id}`);
    }

    // Check if already a team member
    if (project.teamMembers.includes(req.session.userId)) {
      req.flash('error', 'You are already a team member');
      return res.redirect(`/projects/${project._id}`);
    }

    // Check if already requested
    const existingRequest = await JoinRequest.findOne({
      user: req.session.userId,
      project: project._id
    });

    if (existingRequest) {
      req.flash('error', 'You have already sent a join request');
      return res.redirect(`/projects/${project._id}`);
    }

    // Check if team is full
    if (project.teamMembers.length >= project.maxTeamSize) {
      req.flash('error', 'Team is full');
      return res.redirect(`/projects/${project._id}`);
    }

    const { message } = req.body;

    // Create join request
    await JoinRequest.create({
      user: req.session.userId,
      project: project._id,
      message: message || ''
    });

    // Create notification for project owner
    await Notification.create({
      user: project.owner._id,
      type: 'join_request',
      message: `${req.session.userName} wants to join your project "${project.title}"`,
      link: `/join-requests`
    });

    req.flash('success', 'Join request sent successfully!');
    res.redirect(`/projects/${project._id}`);
  } catch (error) {
    console.error('Join request error:', error);
    req.flash('error', 'Could not send join request');
    res.redirect(`/projects/${req.params.id}`);
  }
});

// View join requests for my projects
router.get('/join-requests', isAuthenticated, async (req, res) => {
  try {
    // Get user's projects
    const myProjects = await Project.find({ owner: req.session.userId });
    const projectIds = myProjects.map(p => p._id);

    // Get join requests
    const requests = await JoinRequest.find({
      project: { $in: projectIds }
    })
      .populate('user', 'name email skills')
      .populate('project', 'title requiredSkills')
      .sort({ createdAt: -1 });

    res.render('join-requests', {
      title: 'Join Requests',
      requests
    });
  } catch (error) {
    console.error('Join requests error:', error);
    req.flash('error', 'Could not load join requests');
    res.redirect('/dashboard');
  }
});

// View my sent requests
router.get('/my-requests', isAuthenticated, async (req, res) => {
  try {
    const requests = await JoinRequest.find({ user: req.session.userId })
      .populate('project', 'title owner')
      .populate({
        path: 'project',
        populate: { path: 'owner', select: 'name' }
      })
      .sort({ createdAt: -1 });

    res.render('my-requests', {
      title: 'My Join Requests',
      requests
    });
  } catch (error) {
    console.error('My requests error:', error);
    req.flash('error', 'Could not load your requests');
    res.redirect('/dashboard');
  }
});

// Accept join request
router.post('/requests/:id/accept', isAuthenticated, async (req, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id)
      .populate('project')
      .populate('user', 'name');

    if (!request) {
      req.flash('error', 'Request not found');
      return res.redirect('/join-requests');
    }

    // Check if user is the project owner
    if (request.project.owner.toString() !== req.session.userId) {
      req.flash('error', 'Access denied');
      return res.redirect('/join-requests');
    }

    // Check if team is full
    if (request.project.teamMembers.length >= request.project.maxTeamSize) {
      req.flash('error', 'Team is full');
      return res.redirect('/join-requests');
    }

    // Update request status
    request.status = 'Accepted';
    await request.save();

    // Add user to team
    request.project.teamMembers.push(request.user._id);
    await request.project.save();

    // Create notification
    await Notification.create({
      user: request.user._id,
      type: 'request_accepted',
      message: `Your request to join "${request.project.title}" has been accepted!`,
      link: `/projects/${request.project._id}`
    });

    req.flash('success', `${request.user.name} added to team!`);
    res.redirect('/join-requests');
  } catch (error) {
    console.error('Accept request error:', error);
    req.flash('error', 'Could not accept request');
    res.redirect('/join-requests');
  }
});

// Reject join request
router.post('/requests/:id/reject', isAuthenticated, async (req, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id)
      .populate('project')
      .populate('user', 'name');

    if (!request) {
      req.flash('error', 'Request not found');
      return res.redirect('/join-requests');
    }

    // Check if user is the project owner
    if (request.project.owner.toString() !== req.session.userId) {
      req.flash('error', 'Access denied');
      return res.redirect('/join-requests');
    }

    // Update request status
    request.status = 'Rejected';
    await request.save();

    // Create notification
    await Notification.create({
      user: request.user._id,
      type: 'request_rejected',
      message: `Your request to join "${request.project.title}" was not accepted`,
      link: `/projects`
    });

    req.flash('success', 'Request rejected');
    res.redirect('/join-requests');
  } catch (error) {
    console.error('Reject request error:', error);
    req.flash('error', 'Could not reject request');
    res.redirect('/join-requests');
  }
});

module.exports = router;
