const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const { isAdmin } = require('../middleware/admin');

// Admin Dashboard
router.get('/admin', isAdmin, async (req, res) => {
  try {
    // Get statistics
    const totalUsers = await User.countDocuments();
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: { $in: ['Open', 'In Progress'] } });

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('-password');

    // Get recent projects
    const recentProjects = await Project.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.render('admin-dashboard', {
      title: 'Admin Dashboard',
      stats: {
        totalUsers,
        totalProjects,
        activeProjects
      },
      recentUsers,
      recentProjects
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    req.flash('error', 'Could not load admin dashboard');
    res.redirect('/dashboard');
  }
});

// Delete user (admin only)
router.post('/admin/users/:id/delete', isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      req.flash('error', 'User not found');
      return res.redirect('/admin');
    }

    // Prevent deleting yourself
    if (user._id.toString() === req.session.userId) {
      req.flash('error', 'You cannot delete your own account');
      return res.redirect('/admin');
    }

    // Delete user's projects
    await Project.deleteMany({ owner: user._id });

    // Delete user
    await User.findByIdAndDelete(user._id);

    req.flash('success', 'User and their projects deleted successfully');
    res.redirect('/admin');
  } catch (error) {
    console.error('Delete user error:', error);
    req.flash('error', 'Could not delete user');
    res.redirect('/admin');
  }
});

// Delete project (admin only)
router.post('/admin/projects/:id/delete', isAdmin, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      req.flash('error', 'Project not found');
      return res.redirect('/admin');
    }

    await Project.findByIdAndDelete(project._id);

    req.flash('success', 'Project deleted successfully');
    res.redirect('/admin');
  } catch (error) {
    console.error('Delete project error:', error);
    req.flash('error', 'Could not delete project');
    res.redirect('/admin');
  }
});

module.exports = router;
