const User = require('../models/User');

// Middleware to check if user is an admin
const isAdmin = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      req.flash('error', 'Please log in to access this page');
      return res.redirect('/login');
    }

    const user = await User.findById(req.session.userId);
    
    if (!user || !user.isAdmin) {
      req.flash('error', 'Access denied. Admin privileges required.');
      return res.redirect('/dashboard');
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.redirect('/dashboard');
  }
};

module.exports = { isAdmin };
