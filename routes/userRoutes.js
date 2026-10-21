const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Bookmark = require('../models/Bookmark');
const Notification = require('../models/Notification');
const { isAuthenticated } = require('../middleware/auth');

// Dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    
    // Get user's projects
    const myProjects = await Project.find({ owner: req.session.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get bookmarked projects
    const bookmarks = await Bookmark.find({ user: req.session.userId })
      .populate('project')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get unread notifications
    const notifications = await Notification.find({ user: req.session.userId, read: false })
      .sort({ createdAt: -1 })
      .limit(5);

    // Get join requests for user's projects
    const JoinRequest = require('../models/JoinRequest');
    const joinRequests = await JoinRequest.find({
      project: { $in: myProjects.map(p => p._id) },
      status: 'Pending'
    }).populate('user', 'name email')
      .populate('project', 'title');

    res.render('dashboard', {
      title: 'Dashboard',
      user,
      myProjects,
      bookmarks: bookmarks.map(b => b.project),
      notifications,
      joinRequestCount: joinRequests.length
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    req.flash('error', 'Could not load dashboard');
    res.redirect('/');
  }
});

// My Projects
router.get('/my-projects', isAuthenticated, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.session.userId })
      .sort({ createdAt: -1 });

    res.render('my-projects', {
      title: 'My Projects',
      projects
    });
  } catch (error) {
    console.error('My projects error:', error);
    req.flash('error', 'Could not load your projects');
    res.redirect('/dashboard');
  }
});

// Saved/Bookmarked Projects
router.get('/saved-projects', isAuthenticated, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.session.userId })
      .populate({
        path: 'project',
        populate: { path: 'owner', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    const projects = bookmarks.map(b => b.project).filter(p => p !== null);

    res.render('saved-projects', {
      title: 'Saved Projects',
      projects
    });
  } catch (error) {
    console.error('Saved projects error:', error);
    req.flash('error', 'Could not load saved projects');
    res.redirect('/dashboard');
  }
});

// Profile
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    
    res.render('profile', {
      title: 'My Profile',
      user
    });
  } catch (error) {
    console.error('Profile error:', error);
    req.flash('error', 'Could not load profile');
    res.redirect('/dashboard');
  }
});

// Update Profile
router.post('/profile', isAuthenticated, async (req, res) => {
  try {
    const { name, bio, skills } = req.body;

    // Parse skills from comma-separated string
    const skillsArray = skills ? skills.split(',').map(s => s.trim()).filter(s => s) : [];

    const user = await User.findByIdAndUpdate(
      req.session.userId,
      {
        name,
        bio,
        skills: skillsArray
      },
      { new: true }
    );

    // Update session name
    req.session.userName = user.name;

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
  } catch (error) {
    console.error('Update profile error:', error);
    req.flash('error', 'Could not update profile');
    res.redirect('/profile');
  }
});

// Portfolio
router.get('/portfolio/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/projects');
    }

    // Get user's projects
    const projects = await Project.find({ owner: user._id })
      .sort({ createdAt: -1 });

    // Get projects where user is a team member
    const collaborations = await Project.find({
      teamMembers: user._id,
      owner: { $ne: user._id }
    }).populate('owner', 'name');

    res.render('portfolio', {
      title: `${user.name}'s Portfolio`,
      portfolioUser: user,
      projects,
      collaborations
    });
  } catch (error) {
    console.error('Portfolio error:', error);
    req.flash('error', 'Could not load portfolio');
    res.redirect('/projects');
  }
});

// Bookmark/Unbookmark project
router.post('/projects/:id/bookmark', isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      user: req.session.userId,
      project: project._id
    });

    if (existingBookmark) {
      // Remove bookmark
      await Bookmark.deleteOne({ _id: existingBookmark._id });
      project.bookmarkCount = Math.max(0, project.bookmarkCount - 1);
      await project.save();
      
      return res.json({ success: true, bookmarked: false });
    } else {
      // Add bookmark
      await Bookmark.create({
        user: req.session.userId,
        project: project._id
      });
      project.bookmarkCount += 1;
      await project.save();
      
      return res.json({ success: true, bookmarked: true });
    }
  } catch (error) {
    console.error('Bookmark error:', error);
    res.status(500).json({ error: 'Could not update bookmark' });
  }
});

module.exports = router;
