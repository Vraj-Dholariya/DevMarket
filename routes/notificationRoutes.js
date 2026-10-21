const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { isAuthenticated } = require('../middleware/auth');

// View all notifications
router.get('/notifications', isAuthenticated, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.session.userId })
      .sort({ createdAt: -1 });

    res.render('notifications', {
      title: 'Notifications',
      notifications
    });
  } catch (error) {
    console.error('Notifications error:', error);
    req.flash('error', 'Could not load notifications');
    res.redirect('/dashboard');
  }
});

// Mark notification as read
router.post('/notifications/:id/read', isAuthenticated, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    // Check ownership
    if (notification.user.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Could not update notification' });
  }
});

// Mark all notifications as read
router.post('/notifications/read-all', isAuthenticated, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.session.userId, read: false },
      { read: true }
    );

    req.flash('success', 'All notifications marked as read');
    res.redirect('/notifications');
  } catch (error) {
    console.error('Mark all read error:', error);
    req.flash('error', 'Could not update notifications');
    res.redirect('/notifications');
  }
});

module.exports = router;
