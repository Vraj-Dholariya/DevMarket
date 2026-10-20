require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const path = require('path');
const connectDB = require('./config/db');
const Project = require('./models/Project');
const { calculateReadinessScore } = require('./utils/skillMatch');

const app = express();

// Connect to MongoDB
connectDB();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/vue', express.static(path.join(__dirname, 'vue')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

// Flash messages
app.use(flash());

// Global variables for views
app.use((req, res, next) => {
  res.locals.user = req.session.userId ? {
    id: req.session.userId,
    name: req.session.userName,
    isAdmin: req.session.isAdmin
  } : null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.get('/', async (req, res) => {
  try {
    // Get trending projects (most bookmarked and recently updated)
    const trendingProjects = await Project.find()
      .populate('owner', 'name')
      .sort({ bookmarkCount: -1, updatedAt: -1 })
      .limit(6);

    // Get recent projects
    const recentProjects = await Project.find()
      .populate('owner', 'name')
      .sort({ createdAt: -1 })
      .limit(6);

    res.render('home', {
      title: 'DevMarket - Developer Project Marketplace',
      trendingProjects,
      recentProjects
    });
  } catch (error) {
    console.error('Home page error:', error);
    res.render('home', {
      title: 'DevMarket - Developer Project Marketplace',
      trendingProjects: [],
      recentProjects: []
    });
  }
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const requestRoutes = require('./routes/requestRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use routes
app.use('/', authRoutes);
app.use('/', projectRoutes);
app.use('/', userRoutes);
app.use('/', requestRoutes);
app.use('/', notificationRoutes);
app.use('/', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', { title: 'Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}`);
});
