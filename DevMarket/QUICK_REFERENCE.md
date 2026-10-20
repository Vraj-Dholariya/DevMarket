# DevMarket - Quick Reference Card

## 🗂️ File Structure Cheat Sheet

```
devmarket/
├── server.js              ← START HERE - App entry point
├── .env                   ← Configuration (ports, database)
│
├── config/
│   └── db.js             ← MongoDB connection
│
├── models/               ← Data structures (what gets saved)
│   ├── User.js          ← name, email, password, skills
│   ├── Project.js       ← title, description, owner, team
│   ├── Bookmark.js      ← user + project link
│   ├── JoinRequest.js   ← user wants to join project
│   └── Notification.js  ← messages for users
│
├── routes/              ← URL handlers (what happens when)
│   ├── authRoutes.js    ← /register, /login, /logout
│   ├── projectRoutes.js ← /projects, /create, /edit
│   ├── userRoutes.js    ← /dashboard, /profile
│   ├── requestRoutes.js ← /join-requests, /accept
│   ├── notificationRoutes.js ← /notifications
│   └── adminRoutes.js   ← /admin
│
├── middleware/          ← Request checkers
│   ├── auth.js         ← Is user logged in?
│   └── admin.js        ← Is user admin?
│
├── utils/              ← Helper functions
│   └── skillMatch.js   ← Calculate skill match %
│
├── views/              ← What user sees (HTML)
│   ├── partials/       ← Reusable pieces
│   │   ├── navbar.ejs  ← Top navigation
│   │   ├── footer.ejs  ← Bottom section
│   │   └── messages.ejs← Success/error alerts
│   ├── home.ejs        ← Homepage
│   ├── login.ejs       ← Login page
│   ├── dashboard.ejs   ← User dashboard
│   └── ...             ← 17 pages total
│
├── vue/                ← Interactive components
│   ├── skill-match.js  ← Skill percentage display
│   └── progress-tracker.js ← Milestone tracker
│
└── public/             ← Static files
    ├── css/
    │   ├── input.css   ← Tailwind source
    │   └── style.css   ← Compiled CSS
    └── js/
        └── main.js     ← Dark mode, bookmarks, etc.
```

---

## 🚀 Common Tasks

### Add a New Page

1. **Create route** (routes/yourRoutes.js):
```javascript
router.get('/new-page', isAuthenticated, (req, res) => {
  res.render('new-page', { title: 'New Page' });
});
```

2. **Create view** (views/new-page.ejs):
```html
<%- include('partials/navbar') %>
<h1>New Page</h1>
<%- include('partials/footer') %>
```

3. **Register route** (server.js):
```javascript
const yourRoutes = require('./routes/yourRoutes');
app.use('/', yourRoutes);
```

### Add a Database Field

1. **Update model** (models/User.js):
```javascript
const schema = new mongoose.Schema({
  // ... existing fields
  newField: {
    type: String,
    default: ''
  }
});
```

2. **Update form** (views/profile.ejs):
```html
<input name="newField" value="<%= user.newField %>">
```

3. **Update route** (routes/userRoutes.js):
```javascript
const { newField } = req.body;
user.newField = newField;
await user.save();
```

### Add Authentication to Route

```javascript
// Before
router.get('/page', (req, res) => {
  res.render('page');
});

// After
const { isAuthenticated } = require('../middleware/auth');

router.get('/page', isAuthenticated, (req, res) => {
  res.render('page');
});
```

---

## 🔑 Key Concepts

### Request Object (req)
```javascript
req.body           // Form data (POST)
req.params         // URL parameters (/users/:id)
req.query          // Query string (?search=term)
req.session        // User session data
req.flash          // Success/error messages
```

### Response Object (res)
```javascript
res.render('view', { data })  // Show EJS page
res.redirect('/path')         // Go to different page
res.json({ data })           // Send JSON
res.status(404).send()       // Set status code
```

### Mongoose Methods
```javascript
// Find
Model.find()              // All documents
Model.findById(id)        // By ID
Model.findOne({ email })  // First match

// Create
new Model({ data })      // Create instance
model.save()             // Save to DB
Model.create({ data })   // Create and save

// Update
Model.findByIdAndUpdate(id, { data })
model.field = value; await model.save()

// Delete
Model.findByIdAndDelete(id)
Model.deleteMany({ criteria })

// Populate (load references)
Model.find().populate('owner')
```

### EJS Syntax
```ejs
<%= variable %>           ← Output (escaped)
<%- htmlContent %>        ← Output (raw HTML)
<% javascript code %>     ← Run code (no output)

<!-- If statements -->
<% if (condition) { %>
  <p>Content</p>
<% } else { %>
  <p>Other</p>
<% } %>

<!-- Loops -->
<% items.forEach(item => { %>
  <div><%= item.name %></div>
<% }) %>

<!-- Include -->
<%- include('partials/navbar') %>
```

---

## 🎯 Common Patterns

### CRUD Pattern (Create, Read, Update, Delete)

```javascript
// CREATE
router.post('/items', async (req, res) => {
  const item = new Item(req.body);
  await item.save();
  res.redirect('/items');
});

// READ (list)
router.get('/items', async (req, res) => {
  const items = await Item.find();
  res.render('items', { items });
});

// READ (single)
router.get('/items/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.render('item-details', { item });
});

// UPDATE
router.post('/items/:id', async (req, res) => {
  await Item.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/items');
});

// DELETE
router.post('/items/:id/delete', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/items');
});
```

### Error Handling Pattern

```javascript
router.post('/action', async (req, res) => {
  try {
    // Your code here
    const result = await Model.save();
    req.flash('success', 'Success!');
    res.redirect('/success-page');
  } catch (error) {
    console.error('Error:', error);
    req.flash('error', 'Something went wrong');
    res.redirect('/error-page');
  }
});
```

### Protected Route Pattern

```javascript
router.get('/protected', isAuthenticated, async (req, res) => {
  // Only logged-in users reach here
  const userId = req.session.userId;
  // ... your code
});
```

---

## 🔍 Debugging Checklist

### Server won't start
- [ ] MongoDB running?
- [ ] Port already in use?
- [ ] Check `.env` file exists
- [ ] Run `npm install`

### Page shows 404
- [ ] Route registered in server.js?
- [ ] URL spelling correct?
- [ ] Method correct (GET/POST)?

### Page shows 500
- [ ] Check server console for errors
- [ ] Check browser console (F12)
- [ ] Database connected?
- [ ] All required data passed to view?

### Data not saving
- [ ] Model schema correct?
- [ ] await on async operations?
- [ ] Error in try-catch?
- [ ] Check MongoDB with Compass

### Authentication not working
- [ ] User logged in? (check session)
- [ ] Middleware added to route?
- [ ] Password hashed before saving?
- [ ] Session secret set in .env?

---

## 📝 Code Snippets

### Create a new route file
```javascript
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const Model = require('../models/Model');

router.get('/path', isAuthenticated, async (req, res) => {
  try {
    const data = await Model.find();
    res.render('view', { data });
  } catch (error) {
    req.flash('error', 'Error loading data');
    res.redirect('/');
  }
});

module.exports = router;
```

### Create a new model
```javascript
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  field1: {
    type: String,
    required: true
  },
  field2: {
    type: Number,
    default: 0
  },
  reference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OtherModel'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ModelName', schema);
```

### Create a new view
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body class="flex flex-col min-h-screen">
  <%- include('partials/navbar') %>

  <main class="flex-1 py-12">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-4xl font-bold mb-8"><%= title %></h1>
      
      <%- include('partials/messages') %>
      
      <!-- Your content here -->
      
    </div>
  </main>

  <%- include('partials/footer') %>
  <script src="/js/main.js"></script>
</body>
</html>
```

---

## 🎓 Learning Order

### Day 1: Basics
1. Read `server.js` - understand setup
2. Read one model (User.js) - understand data
3. Read one route (authRoutes.js) - understand flow
4. Read one view (login.ejs) - understand display

### Day 2: Follow a Feature
Pick ONE feature and trace it:
1. Click button in browser
2. Find the URL/form action
3. Find the route handler
4. See what database operations happen
5. See what view is rendered
6. See what data is passed

### Day 3: Modify Something
1. Add a new field to User profile
2. OR change button text
3. OR add a filter option
4. Test your change

### Day 4: Build Something New
1. Add a comment system
2. OR add project tags
3. OR add search history

---

## 💡 Tips

- **Start small** - Understand one file at a time
- **Use console.log()** - See what data looks like
- **Read error messages** - They tell you what's wrong
- **Break when confused** - Step away, come back fresh
- **Google is OK** - Everyone looks things up
- **Practice** - Modify existing code before writing new

---

## 📚 Learning Resources

**Files to Read First:**
1. `server.js` → App entry point
2. `models/User.js` → Data structure
3. `routes/authRoutes.js` → Request handling
4. `views/login.ejs` → Display
5. `public/js/main.js` → Client-side

**Best Learning Path:**
```
server.js → config/db.js → models/ → routes/ → views/
```

**When Stuck:**
1. Read error message carefully
2. Check server console
3. Check browser console (F12)
4. Add console.log() to debug
5. Google the error message

---

## ✅ Quick Commands

```bash
# Start dev server (auto-restart)
npm run dev

# Start production server
npm start

# Build Tailwind CSS
npm run build:css

# Install dependencies
npm install

# Fix database (if corrupted)
node fix-database.js

# Check if MongoDB running
Get-Service MongoDB
```

---

This reference card + the detailed guide should help you understand every part of the code! Start with the learning guide, use this as a quick reference when coding. 🚀
