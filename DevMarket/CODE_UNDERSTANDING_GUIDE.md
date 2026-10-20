# DevMarket - Complete Code Understanding Guide

## 📚 Learning Path: Beginner to Expert

Follow this step-by-step guide to understand every part of the DevMarket codebase.

---

## 🎯 Overview: How the App Works

### The Big Picture
```
User's Browser  →  Express Server  →  MongoDB Database
     ↓                    ↓                  ↓
   HTML/CSS          Routes/Logic        Data Storage
   Vue.js            Middleware          Collections
   JavaScript        EJS Templates       Documents
```

### Request Flow Example (User Registration)
```
1. User fills registration form (register.ejs)
2. Form submits to POST /register (authRoutes.js)
3. Route validates data and hashes password
4. Creates new User document (User.js model)
5. Saves to MongoDB database
6. Redirects to login page with success message
7. EJS renders login.ejs with flash message
```

---

## 📖 Step-by-Step Learning Guide

---

## STEP 1: Understand the Entry Point (10 minutes)

### File: `server.js`
**What it does:** Starts the entire application

**Read in this order:**

#### 1.1 Imports and Setup (Lines 1-10)
```javascript
require('dotenv').config();           // Loads environment variables from .env
const express = require('express');    // Web framework
const session = require('express-session'); // User sessions
const MongoStore = require('connect-mongo'); // Session storage in MongoDB
const flash = require('connect-flash');     // Success/error messages
```

**What this means:** The app loads all necessary tools before starting.

#### 1.2 Database Connection (Lines 11-13)
```javascript
const connectDB = require('./config/db');
connectDB();  // Connects to MongoDB
```

**What this means:** Establishes connection to MongoDB database.

#### 1.3 View Engine (Lines 15-16)
```javascript
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
```

**What this means:** Tells Express to use EJS templates from the `views` folder.

#### 1.4 Middleware (Lines 18-41)
```javascript
app.use(express.json());              // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(express.static(...));         // Serve CSS/JS files
app.use(session({ ... }));            // Enable sessions
app.use(flash());                     // Enable flash messages
```

**What this means:** Middleware processes every request before it reaches routes.

#### 1.5 Routes (Lines 66-72)
```javascript
app.use('/', authRoutes);      // /register, /login, /logout
app.use('/', projectRoutes);   // /projects, /projects/:id
app.use('/', userRoutes);      // /dashboard, /profile
// ... more routes
```

**What this means:** Connects URL patterns to their handler files.

#### 1.6 Start Server (Lines 108-111)
```javascript
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**What this means:** Starts listening for incoming HTTP requests.

**🎓 Key Learning:** `server.js` is like the conductor of an orchestra - it sets everything up and coordinates all parts.

---

## STEP 2: Understand the Database (15 minutes)

### File: `config/db.js`
**What it does:** Connects to MongoDB

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);  // Exit if can't connect
  }
};
```

**What this means:** 
- Uses Mongoose (MongoDB library)
- Connects using connection string from `.env` file
- Exits app if connection fails (because we can't run without database)

---

## STEP 3: Understand Data Models (20 minutes)

### File: `models/User.js`
**What it does:** Defines how user data is structured and stored

#### 3.1 Schema Definition (Lines 4-32)
```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,      // Data type
    required: true,    // Must be provided
    trim: true        // Remove extra spaces
  },
  email: {
    type: String,
    required: true,
    unique: true,     // No duplicates
    lowercase: true   // Always store lowercase
  },
  password: {
    type: String,
    required: true
  },
  skills: [{          // Array of strings
    type: String
  }],
  isAdmin: {
    type: Boolean,
    default: false    // Default value
  }
});
```

**What this means:** Like a blueprint that says "every user must have these fields with these rules".

#### 3.2 Password Hashing (Lines 34-43)
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**What this means:** 
- **pre('save')** = runs BEFORE saving to database
- **isModified** = only hash if password changed
- **bcrypt.hash** = encrypts password (can't be reversed)
- **Why?** Never store passwords in plain text!

#### 3.3 Password Comparison (Lines 45-47)
```javascript
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

**What this means:** 
- Adds a method to check if password matches
- During login, compares entered password with hashed version
- Returns true if match, false if not

**🎓 Key Learning:** Models define data structure + business logic.

---

### File: `models/Project.js`
**What it does:** Defines project data structure

**Key parts:**

1. **Embedded Schema** (milestones inside project):
```javascript
const milestoneSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false }
});

const projectSchema = new mongoose.Schema({
  // ... other fields
  milestones: [milestoneSchema],  // Array of milestones
});
```

2. **References** (linking to other collections):
```javascript
owner: {
  type: mongoose.Schema.Types.ObjectId,  // ID of another document
  ref: 'User',                           // Points to User collection
  required: true
},
teamMembers: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}]
```

**What this means:**
- **Embedded:** Milestones stored inside project document
- **Referenced:** Owner/team members stored separately, linked by ID
- **Why?** Avoids duplicating user data; updates user once, reflected everywhere

**🎓 Key Learning:** Use references when data is shared, embed when data is unique to parent.

---

## STEP 4: Understand Middleware (15 minutes)

### File: `middleware/auth.js`
**What it does:** Checks if user is logged in

```javascript
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();  // User logged in, continue
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/login');  // Not logged in, redirect
};
```

**What this means:**
- **req.session** = stores data for each user (created by express-session)
- **userId** = stored when user logs in
- **next()** = continue to the route handler
- **redirect** = send user to login page

**How it's used:**
```javascript
// In routes:
router.get('/dashboard', isAuthenticated, (req, res) => {
  // This only runs if isAuthenticated calls next()
  res.render('dashboard');
});
```

**🎓 Key Learning:** Middleware runs between request and route handler - perfect for checking permissions.

---

### File: `middleware/admin.js`
**What it does:** Checks if user is an admin

```javascript
const isAdmin = async (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');  // Not logged in
  }

  const user = await User.findById(req.session.userId);
  
  if (!user || !user.isAdmin) {
    req.flash('error', 'Access denied. Admin privileges required.');
    return res.redirect('/dashboard');  // Not admin
  }

  next();  // Is admin, continue
};
```

**What this means:**
1. Check if logged in
2. Load user from database
3. Check if user has isAdmin flag
4. Only allow if all checks pass

**🎓 Key Learning:** Stack multiple checks for security - logged in + specific permission.

---

## STEP 5: Understand Routes (30 minutes)

### File: `routes/authRoutes.js`
**What it does:** Handles registration, login, logout

#### Registration Flow (Lines 12-52)

```javascript
// 1. Show registration form
router.get('/register', isGuest, (req, res) => {
  res.render('register');
});

// 2. Handle form submission
router.post('/register', isGuest, async (req, res) => {
  try {
    // 2a. Get form data
    const { name, email, password, confirmPassword } = req.body;

    // 2b. Validate
    if (!name || !email || !password) {
      req.flash('error', 'All fields are required');
      return res.redirect('/register');
    }

    // 2c. Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.redirect('/register');
    }

    // 2d. Create new user
    const user = new User({ name, email, password });
    await user.save();  // Password gets hashed automatically!

    // 2e. Success
    req.flash('success', 'Registration successful!');
    res.redirect('/login');
  } catch (error) {
    // 2f. Handle errors
    req.flash('error', 'Registration failed');
    res.redirect('/register');
  }
});
```

**Step-by-step breakdown:**
1. User visits /register (GET) → Shows form
2. User submits form (POST) → Processes data
3. Validation checks → Ensure data is correct
4. Database check → Ensure email not taken
5. Create user → Saves to database (password auto-hashed)
6. Redirect → Send to login with success message

**🎓 Key Learning:** GET = show page, POST = process form, always validate!

---

#### Login Flow (Lines 54-88)

```javascript
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    // 2. Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password');
      return res.redirect('/login');
    }

    // 3. Create session
    req.session.userId = user._id;
    req.session.userName = user.name;
    req.session.isAdmin = user.isAdmin;

    // 4. Redirect to dashboard
    req.flash('success', `Welcome back, ${user.name}!`);
    res.redirect('/dashboard');
  } catch (error) {
    req.flash('error', 'Login failed');
    res.redirect('/login');
  }
});
```

**What happens:**
1. User submits email + password
2. Find user in database
3. Compare password (using bcrypt)
4. If match, store user info in session
5. Redirect to dashboard

**Why session?**
- Session = data stored on server for each user
- SessionID sent to browser as cookie
- Browser sends cookie with every request
- Server uses cookie to identify user

**🎓 Key Learning:** Sessions remember who you are across multiple pages.

---

### File: `routes/projectRoutes.js`
**What it does:** Handles all project operations

#### Create Project (Lines 97-130)

```javascript
router.post('/projects', isAuthenticated, async (req, res) => {
  const { title, description, category, difficulty, technologies, requiredSkills } = req.body;

  // Parse comma-separated strings into arrays
  const techArray = technologies.split(',').map(t => t.trim());
  const skillsArray = requiredSkills.split(',').map(s => s.trim());

  // Create project
  const project = new Project({
    title,
    description,
    category,
    difficulty,
    technologies: techArray,
    requiredSkills: skillsArray,
    owner: req.session.userId  // Current logged-in user
  });

  await project.save();
  res.redirect(`/projects/${project._id}`);
});
```

**Key concepts:**
- **split(',')** = "React, Node.js" → ["React", "Node.js"]
- **map(t => t.trim())** = Remove spaces from each item
- **owner: req.session.userId** = Link project to current user

---

#### View Project Details (Lines 28-80)

```javascript
router.get('/projects/:id', async (req, res) => {
  // 1. Find project and load related data
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email skills')      // Load owner details
    .populate('teamMembers', 'name email skills'); // Load team details

  // 2. Increment view count
  project.viewCount += 1;
  await project.save();

  // 3. If user logged in, calculate skill match
  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    skillMatch = calculateSkillMatch(user.skills, project.requiredSkills);
  }

  // 4. Render page with all data
  res.render('project-details', { project, skillMatch });
});
```

**Key concepts:**
- **:id** in URL = dynamic parameter (e.g., /projects/abc123)
- **req.params.id** = gets the abc123 part
- **populate()** = loads referenced documents
- **Without populate:** owner is just an ID
- **With populate:** owner is full user object

**🎓 Key Learning:** Use populate() to load related data from references.

---

## STEP 6: Understand Utilities (10 minutes)

### File: `utils/skillMatch.js`
**What it does:** Calculates skill match percentage

```javascript
const calculateSkillMatch = (userSkills, requiredSkills) => {
  // 1. Handle edge cases
  if (!requiredSkills || requiredSkills.length === 0) {
    return { percentage: 100, missingSkills: [] };
  }
  if (!userSkills || userSkills.length === 0) {
    return { percentage: 0, missingSkills: requiredSkills };
  }

  // 2. Normalize (lowercase, trim)
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());
  const normalizedRequiredSkills = requiredSkills.map(s => s.toLowerCase().trim());

  // 3. Find matching skills
  const matchingSkills = normalizedRequiredSkills.filter(skill => 
    normalizedUserSkills.includes(skill)
  );

  // 4. Find missing skills
  const missingSkills = requiredSkills.filter(skill => 
    !normalizedUserSkills.includes(skill.toLowerCase().trim())
  );

  // 5. Calculate percentage
  const percentage = Math.round((matchingSkills.length / normalizedRequiredSkills.length) * 100);

  return { percentage, missingSkills };
};
```

**Example:**
```
User has: ["JavaScript", "React", "Node.js"]
Project needs: ["JavaScript", "React", "MongoDB", "Docker"]

Matching: JavaScript, React (2)
Missing: MongoDB, Docker (2)
Percentage: 2/4 = 50%
```

**Why normalize?**
- User might type "javascript" or "JavaScript"
- Normalization makes comparison case-insensitive

**🎓 Key Learning:** Pure functions (no database, no side effects) are easy to test and reuse.

---

## STEP 7: Understand Views (EJS Templates) (20 minutes)

### File: `views/home.ejs`
**What it does:** Renders the homepage

#### Understanding EJS Syntax

```ejs
<!-- 1. Include other files -->
<%- include('partials/navbar') %>

<!-- 2. Output variables (escaped HTML) -->
<h1>Welcome to <%= title %></h1>

<!-- 3. Output raw HTML (unescaped) -->
<%- htmlContent %>

<!-- 4. JavaScript code -->
<% if (user) { %>
  <p>Hello, <%= user.name %>!</p>
<% } else { %>
  <p>Please login</p>
<% } %>

<!-- 5. Loops -->
<% projects.forEach(project => { %>
  <div><%= project.title %></div>
<% }) %>
```

**Key concepts:**
- **<%= %>** = Output and escape (safe for user input)
- **<%- %>** = Output without escaping (for HTML includes)
- **<% %>** = Run JavaScript (no output)

---

#### Example: Displaying Projects

```ejs
<% if (projects && projects.length > 0) { %>
  <div class="grid">
    <% projects.forEach(project => { %>
      <div class="card">
        <h3><%= project.title %></h3>
        <p><%= project.description %></p>
        
        <!-- Technologies loop -->
        <% project.technologies.forEach(tech => { %>
          <span class="badge"><%= tech %></span>
        <% }) %>
        
        <!-- Owner with safety check -->
        <span>by <%= project.owner ? project.owner.name : 'Unknown' %></span>
      </div>
    <% }) %>
  </div>
<% } else { %>
  <p>No projects yet.</p>
<% } %>
```

**Flow:**
1. Check if projects exist and has items
2. Loop through each project
3. Display project data
4. Nested loop for technologies
5. Safety check for owner (might not be loaded)
6. Show message if no projects

**🎓 Key Learning:** EJS mixes HTML with JavaScript - very flexible but keep logic simple.

---

## STEP 8: Understand Vue.js Components (15 minutes)

### File: `vue/skill-match.js`
**What it does:** Interactive skill match display

```javascript
const SkillMatch = {
  // 1. Props (data passed from parent)
  props: ['userSkills', 'requiredSkills'],
  
  // 2. Component data
  data() {
    return {
      matchPercentage: 0,
      missingSkills: [],
      matchingSkills: []
    };
  },
  
  // 3. Lifecycle hook
  mounted() {
    this.calculateMatch();  // Run when component loads
  },
  
  // 4. Methods
  methods: {
    calculateMatch() {
      // Same logic as utils/skillMatch.js
      this.matchPercentage = /* calculation */;
      this.missingSkills = /* calculation */;
    },
    
    getMatchColor() {
      if (this.matchPercentage >= 80) return 'text-green-600';
      if (this.matchPercentage >= 50) return 'text-yellow-600';
      return 'text-red-600';
    }
  },
  
  // 5. Template (HTML)
  template: `
    <div>
      <span :class="getMatchColor()">{{ matchPercentage }}%</span>
      <div v-for="skill in matchingSkills" :key="skill">
        {{ skill }}
      </div>
    </div>
  `
};
```

**Vue.js concepts:**
- **props** = data from parent
- **data()** = component's own data
- **mounted()** = runs when component loads
- **methods** = functions component can use
- **template** = HTML with Vue directives
- **{{ }}** = display data
- **:class** = bind CSS class
- **v-for** = loop

**How it's used in EJS:**
```ejs
<div id="skillMatchApp">
  <skill-match
    :user-skills='<%= JSON.stringify(user.skills) %>'
    :required-skills='<%= JSON.stringify(project.requiredSkills) %>'
  ></skill-match>
</div>

<script src="/vue/skill-match.js"></script>
<script>
  Vue.createApp({
    components: { 'skill-match': SkillMatch }
  }).mount('#skillMatchApp');
</script>
```

**🎓 Key Learning:** Vue makes parts of the page reactive - change data, UI updates automatically.

---

## STEP 9: Understand Client-Side JavaScript (10 minutes)

### File: `public/js/main.js`
**What it does:** Handles dark mode, bookmarks, etc.

```javascript
// 1. Dark Mode
function initDarkMode() {
  const darkModeToggle = document.getElementById('darkModeToggle');
  
  // Load saved preference
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  
  // Toggle on click
  darkModeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

// 2. Bookmark (AJAX)
async function toggleBookmark(projectId, button) {
  const response = await fetch(`/projects/${projectId}/bookmark`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Update button without page reload
    if (data.bookmarked) {
      button.innerHTML = '🔖 Bookmarked';
    } else {
      button.innerHTML = 'Bookmark';
    }
  }
}

// 3. Run on page load
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
});
```

**Key concepts:**
- **localStorage** = save data in browser (persists after closing)
- **classList.add/toggle** = add/remove CSS class
- **fetch()** = make HTTP request without page reload (AJAX)
- **async/await** = wait for server response
- **DOMContentLoaded** = run when page fully loaded

**🎓 Key Learning:** Client-side JS makes pages interactive without full reload.

---

## STEP 10: Understand the Flow (Bringing It All Together)

### Example: User Bookmarks a Project

1. **User clicks bookmark button**
   - Button: `<button onclick="toggleBookmark('abc123', this)">`
   
2. **JavaScript sends request**
   - File: `public/js/main.js`
   - Function: `toggleBookmark()`
   - Sends: `POST /projects/abc123/bookmark`
   
3. **Express routes the request**
   - File: `server.js`
   - Routes to: `userRoutes.js`
   
4. **Route handler processes**
   - File: `routes/userRoutes.js`
   - Middleware: `isAuthenticated` (checks login)
   - Handler: `POST /projects/:id/bookmark`
   
5. **Database operations**
   - Check if bookmark exists: `Bookmark.findOne()`
   - If exists: delete it
   - If not: create it: `Bookmark.create()`
   - Update count: `project.bookmarkCount += 1`
   
6. **Send response**
   - Return: `{ success: true, bookmarked: true }`
   
7. **JavaScript updates UI**
   - Changes button text
   - No page reload!

---

## 📚 Learning Resources

### 1. Node.js & Express
- **server.js** = Entry point, app setup
- **routes/** = URL handlers
- **middleware/** = Request processors

### 2. MongoDB & Mongoose
- **models/** = Data structure
- **Schema** = Blueprint
- **Methods** = Custom functions
- **Refs** = Relationships

### 3. EJS Templates
- **views/** = HTML pages
- **partials/** = Reusable pieces
- **<%= %>** = Output data
- **<% %>** = Logic

### 4. Vue.js
- **vue/** = Interactive components
- **Props** = Data in
- **Methods** = Functions
- **Template** = HTML

### 5. Frontend
- **public/css/** = Styles (Tailwind)
- **public/js/** = Client scripts
- **Fetch API** = AJAX requests

---

## 🎯 Next Steps to Master the Code

### Week 1: Read and Understand
- [ ] Read server.js (understand flow)
- [ ] Read one model (understand data)
- [ ] Read one route file (understand logic)
- [ ] Read one view (understand display)

### Week 2: Modify and Experiment
- [ ] Add a new field to User model
- [ ] Create a new route
- [ ] Modify a view
- [ ] Add a new feature

### Week 3: Build Something New
- [ ] Add comment system to projects
- [ ] Add project categories
- [ ] Add user ratings
- [ ] Add file uploads

---

## 🔍 Debugging Tips

### When something doesn't work:

1. **Check Server Console**
   - See error messages
   - See what routes are being called
   
2. **Check Browser Console**
   - F12 → Console tab
   - See JavaScript errors
   - See network requests
   
3. **Add Console Logs**
   ```javascript
   console.log('User:', user);
   console.log('Projects:', projects);
   ```
   
4. **Use Debugger**
   ```javascript
   debugger;  // Pause execution here
   ```

---

## 💡 Common Patterns

### 1. Route Pattern
```javascript
router.get('/path', middleware, async (req, res) => {
  try {
    // Get data
    const data = await Model.find();
    // Render view
    res.render('view', { data });
  } catch (error) {
    // Handle error
    req.flash('error', 'Something went wrong');
    res.redirect('/');
  }
});
```

### 2. Model Pattern
```javascript
const schema = new mongoose.Schema({
  field: { type: String, required: true },
  ref: { type: ObjectId, ref: 'Model' }
});

schema.pre('save', function() {
  // Do something before saving
});

schema.methods.customMethod = function() {
  // Add custom method
};
```

### 3. View Pattern
```ejs
<%- include('partials/navbar') %>

<% if (data && data.length > 0) { %>
  <% data.forEach(item => { %>
    <div><%= item.name %></div>
  <% }) %>
<% } else { %>
  <p>No data</p>
<% } %>

<%- include('partials/footer') %>
```

---

## 🎉 You're Ready!

Follow this guide step by step, and you'll understand:
- How the server starts
- How requests are handled
- How data is stored
- How pages are rendered
- How everything connects

**Start with server.js, follow the imports, and trace a single feature from browser to database and back!**
