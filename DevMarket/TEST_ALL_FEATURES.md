# DevMarket - Complete Feature Testing Checklist

**Test Date:** ________________  
**Tester Name:** ________________  
**Browser:** ________________  

---

## 🚀 Server Setup (Do This First)

- [ ] MongoDB is running (check Windows Services)
- [ ] Server is running: `npm start` or `npm run dev`
- [ ] Open browser: http://localhost:3000
- [ ] No errors in browser console (F12 → Console)
- [ ] No errors in server terminal

---

## ✅ Feature Testing (25 Features)

### 1. User Authentication (Basic)

**Test Registration:**
- [ ] Click "Sign Up" button
- [ ] Enter Name: `Test User`
- [ ] Enter Email: `test@test.com`
- [ ] Enter Password: `password123`
- [ ] Enter Confirm Password: `password123`
- [ ] Click "Sign Up"
- [ ] ✅ Success message appears
- [ ] ✅ Redirected to login page

**Test Login:**
- [ ] Enter Email: `test@test.com`
- [ ] Enter Password: `password123`
- [ ] Click "Login"
- [ ] ✅ Success message: "Welcome back, Test User!"
- [ ] ✅ Redirected to dashboard

**Test Logout:**
- [ ] Click on your name (top right)
- [ ] Click "Logout"
- [ ] ✅ Redirected to home page
- [ ] ✅ Navigation shows "Login" and "Sign Up"

**Test Invalid Login:**
- [ ] Try login with wrong password
- [ ] ✅ Error message appears
- [ ] ✅ Not logged in

---

### 2. Developer Profile Management

**Test View Profile:**
- [ ] Login again
- [ ] Click your name → "Profile"
- [ ] ✅ Shows your name and email
- [ ] ✅ Bio field is empty (first time)
- [ ] ✅ Skills field is empty (first time)

**Test Update Profile:**
- [ ] Enter Bio: `Full-stack developer passionate about building web applications`
- [ ] Enter Skills: `JavaScript, React, Node.js, MongoDB, Express, HTML, CSS`
- [ ] Click "Update Profile"
- [ ] ✅ Success message appears
- [ ] ✅ Page refreshes with saved data
- [ ] ✅ Skills are saved (check by refreshing)

---

### 3. Project CRUD Operations

**Test Create Project:**
- [ ] Click "Create Project" (top nav or dashboard)
- [ ] Enter Title: `E-Commerce Platform`
- [ ] Enter Description: `A full-featured online shopping platform with cart, payment integration, user reviews, and admin dashboard`
- [ ] Select Category: `Web Development`
- [ ] Select Difficulty: `Intermediate`
- [ ] Enter Technologies: `React, Node.js, MongoDB, Stripe, Redux, JWT`
- [ ] Enter Required Skills: `JavaScript, React, REST APIs, MongoDB, Authentication`
- [ ] Enter Max Team Size: `5`
- [ ] Click "Create Project"
- [ ] ✅ Redirected to project details page
- [ ] ✅ All information displays correctly

**Test Edit Project:**
- [ ] On project details page, click "Edit"
- [ ] Change Description: Add `with real-time notifications`
- [ ] Change Status to: `In Progress`
- [ ] Click "Update Project"
- [ ] ✅ Success message appears
- [ ] ✅ Changes are saved and visible

**Test My Projects:**
- [ ] Click "My Projects" in navbar
- [ ] ✅ Shows your created project
- [ ] ✅ Shows project stats (views, bookmarks, team)
- [ ] ✅ "View" and "Edit" buttons work

---

### 4. Browse Projects

**Test Browse:**
- [ ] Click "Projects" in navbar
- [ ] ✅ Shows all projects in cards
- [ ] ✅ Each card shows title, description, difficulty, category
- [ ] ✅ Technologies are displayed
- [ ] ✅ Owner name is shown

---

### 5. Project Search

**Test Search:**
- [ ] In search box, type: `ecommerce`
- [ ] Click "Search"
- [ ] ✅ Filters results correctly
- [ ] Clear search box
- [ ] Type: `platform`
- [ ] ✅ Shows matching results
- [ ] Clear search
- [ ] ✅ Shows all projects again

---

### 6. Project Filters

**Test Category Filter:**
- [ ] Select Category: `Web Development`
- [ ] Click "Search"
- [ ] ✅ Shows only Web Development projects

**Test Difficulty Filter:**
- [ ] Select Difficulty: `Intermediate`
- [ ] Click "Search"
- [ ] ✅ Shows only Intermediate projects

**Test Combined Filters:**
- [ ] Select Category: `Web Development`
- [ ] Select Difficulty: `Intermediate`
- [ ] Type in search: `platform`
- [ ] Click "Search"
- [ ] ✅ Shows projects matching all criteria

---

### 7. Project Details Page

**Test Details Display:**
- [ ] Click on any project card
- [ ] ✅ Shows full project description
- [ ] ✅ Shows category and difficulty badges
- [ ] ✅ Shows all technologies
- [ ] ✅ Shows all required skills
- [ ] ✅ Shows team section with owner
- [ ] ✅ Shows view count (increments each visit)
- [ ] ✅ Shows bookmark count
- [ ] ✅ Shows team size (e.g., 0/5)

---

### 8. Save/Bookmark Projects

**Test Bookmark:**
- [ ] On project details page, click "Bookmark" button
- [ ] ✅ Button changes to "🔖 Bookmarked"
- [ ] Go to "Saved Projects" (dropdown menu)
- [ ] ✅ Project appears in saved list
- [ ] Go back to project details
- [ ] Click bookmark button again
- [ ] ✅ Bookmark is removed
- [ ] Go to "Saved Projects"
- [ ] ✅ Project is no longer there

---

### 9. Send Join Requests

**Test Join Request (Create Second User):**

**In a new Incognito/Private browser window:**
- [ ] Go to http://localhost:3000
- [ ] Register new user: `developer2@test.com`, password: `password123`
- [ ] Add skills: `Python, Django, PostgreSQL, Docker`
- [ ] Go to "Projects"
- [ ] Click on the first user's project
- [ ] ✅ "Request to Join" button is visible
- [ ] Click "Request to Join"
- [ ] ✅ Modal appears
- [ ] Enter message: `I'm interested in this project. I have experience with backend development.`
- [ ] Click "Send Request"
- [ ] ✅ Success message appears
- [ ] ✅ Button changes to "Request Sent"

---

### 10. Accept/Reject Join Requests

**Back to First User (original browser):**
- [ ] Refresh the page
- [ ] Click your name → "Join Requests"
- [ ] ✅ Shows incoming request from developer2
- [ ] ✅ Shows their message
- [ ] ✅ Shows skill match percentage
- [ ] ✅ Shows matching and missing skills
- [ ] Click "Accept"
- [ ] ✅ Success message appears
- [ ] ✅ Request disappears from pending
- [ ] Go to your project details
- [ ] ✅ developer2 appears in team section

**Test Reject (if you have another request):**
- [ ] Go to "Join Requests"
- [ ] Click "Reject" on any request
- [ ] ✅ Request is rejected
- [ ] ✅ User notified

---

### 11. Skill Match Percentage (Vue.js)

**Test on Project Details:**
- [ ] Go to any project details page
- [ ] Scroll to right sidebar
- [ ] ✅ "Skill Match" card is visible
- [ ] ✅ Shows percentage (e.g., 80%)
- [ ] ✅ Shows progress bar with correct color:
  - Green for 80%+
  - Yellow for 50-79%
  - Red for <50%
- [ ] ✅ Shows "Matching Skills" in green badges
- [ ] ✅ Shows "Missing Skills" in red badges

---

### 12. Missing Skills Finder (Vue.js)

**Test Missing Skills:**
- [ ] On project details, look at Skill Match section
- [ ] ✅ "Missing Skills" section shows skills you don't have
- [ ] ✅ Each missing skill is in a red badge
- [ ] ✅ Accurate list (compare with your profile skills)

---

### 13. Team Compatibility

**Test Compatibility Message:**
- [ ] On project details with skill match
- [ ] ✅ If 100%: "Perfect match! You have all the required skills."
- [ ] ✅ If 70%+: "Great match! You're well-suited for this project."
- [ ] ✅ If 40-69%: "Good match! Consider learning the missing skills."
- [ ] ✅ If <40%: "This project may be challenging..."

---

### 14. Project Progress Tracker (Vue.js)

**Test Progress (as Project Owner):**
- [ ] Go to your project details
- [ ] Click "View Progress" button
- [ ] ✅ Shows 0% progress (no milestones yet)
- [ ] ✅ Shows progress bar
- [ ] In "Add New Milestone" box, type: `Set up project repository`
- [ ] Click "Add"
- [ ] ✅ Milestone appears immediately
- [ ] Add more milestones:
  - [ ] `Design database schema`
  - [ ] `Create authentication system`
  - [ ] `Build REST API`
  - [ ] `Develop frontend`
- [ ] ✅ All milestones appear in list
- [ ] Click checkbox on first milestone
- [ ] ✅ Milestone marked as complete
- [ ] ✅ Progress percentage updates (20% if 1/5 complete)
- [ ] ✅ Progress bar animates
- [ ] Check 2 more milestones
- [ ] ✅ Progress updates to 60%
- [ ] Uncheck one
- [ ] ✅ Progress goes back to 40%

**Test as Team Member (Second User):**
- [ ] In incognito window (as developer2)
- [ ] Go to the project
- [ ] Click "View Progress"
- [ ] ✅ Can see all milestones
- [ ] ✅ Can toggle completion
- [ ] ✅ Cannot add new milestones (not owner)

---

### 15. Developer Portfolio

**Test Portfolio:**
- [ ] Click on any user's name anywhere on the site
- [ ] ✅ Shows user avatar (first letter of name)
- [ ] ✅ Shows name, email, bio
- [ ] ✅ Shows all skills as badges
- [ ] ✅ Shows "Projects" section with their projects
- [ ] ✅ Shows "Collaborations" section (projects they joined)
- [ ] Click on any project
- [ ] ✅ Navigates to project details

---

### 16. Notification System

**Test Notifications (Second User):**
- [ ] In incognito window (developer2)
- [ ] Click "Notifications"
- [ ] ✅ Shows notification: "Your request to join ... has been accepted!"
- [ ] ✅ Shows timestamp
- [ ] ✅ Unread notification has blue dot
- [ ] Click "View" button
- [ ] ✅ Navigates to the project
- [ ] Go back to notifications
- [ ] Click "Mark Read"
- [ ] ✅ Notification dimmed (marked as read)
- [ ] ✅ Blue dot removed

**Test Mark All Read:**
- [ ] If you have multiple unread notifications
- [ ] Click "Mark All as Read"
- [ ] ✅ All notifications marked as read

---

### 17. Trending Projects

**Test Trending:**
- [ ] Go to home page
- [ ] ✅ "🔥 Trending Projects" section visible
- [ ] ✅ Shows projects sorted by bookmarks and activity
- [ ] ✅ Most bookmarked projects appear first

**Create Trending:**
- [ ] Create 2-3 more projects
- [ ] Bookmark one project multiple times (with different users)
- [ ] Refresh home page
- [ ] ✅ Most bookmarked project appears first in trending

---

### 18. Project Readiness Score

**Test Readiness Score:**
- [ ] Go to any project details page
- [ ] Look at right sidebar
- [ ] ✅ "Project Readiness" card visible
- [ ] ✅ Shows percentage score
- [ ] ✅ Shows progress bar
- [ ] ✅ Shows message based on score:
  - 80%+: "well-defined and ready"
  - 50-79%: "good structure but could use more details"
  - <50%: "needs more planning"

**Test Score Calculation:**
- [ ] Create a new project with minimal info (short description, no skills)
- [ ] ✅ Low score (e.g., 30%)
- [ ] Edit project, add detailed description, skills, technologies
- [ ] ✅ Score increases (e.g., to 70%)
- [ ] Add milestones via progress tracker
- [ ] Refresh project details
- [ ] ✅ Score increases further

---

### 19. Personalized Dashboard

**Test Dashboard:**
- [ ] Click "Dashboard" in navbar
- [ ] ✅ Shows welcome message with your name
- [ ] ✅ Quick stats cards show:
  - My Projects count
  - Saved Projects count
  - Join Requests count
  - Notifications count
- [ ] ✅ Quick action buttons:
  - Create New Project
  - Browse Projects
  - Edit Profile
- [ ] ✅ Recent notifications section (if any)
- [ ] ✅ "My Projects" preview (up to 5)
- [ ] ✅ "Saved Projects" preview (if any)
- [ ] ✅ All "View All" links work

---

### 20. Admin Dashboard

**Test Admin (First, make user admin):**

**Using MongoDB Compass or Shell:**
```javascript
db.users.updateOne(
  { email: "test@test.com" },
  { $set: { isAdmin: true } }
)
```

**Then:**
- [ ] Refresh browser
- [ ] Click your name dropdown
- [ ] ✅ "Admin Dashboard" appears in red
- [ ] Click "Admin Dashboard"
- [ ] ✅ Shows platform statistics:
  - Total Users
  - Total Projects
  - Active Projects
- [ ] ✅ "Recent Users" table shows all users
- [ ] ✅ "Recent Projects" table shows all projects
- [ ] Try to delete a project
- [ ] ✅ Confirmation dialog appears
- [ ] Confirm
- [ ] ✅ Project deleted
- [ ] Try to delete a user (not yourself)
- [ ] ✅ Confirmation appears
- [ ] Confirm
- [ ] ✅ User and their projects deleted

---

### 21. Responsive Design

**Test Desktop (> 1024px):**
- [ ] Full browser window
- [ ] ✅ Navigation is horizontal
- [ ] ✅ Projects show 3 columns
- [ ] ✅ All buttons visible
- [ ] ✅ Dropdown menu works

**Test Tablet (768px - 1024px):**
- [ ] Resize browser to ~800px width
- [ ] ✅ Navigation still horizontal
- [ ] ✅ Projects show 2 columns
- [ ] ✅ Content adjusts properly

**Test Mobile (< 768px):**
- [ ] Resize browser to ~400px width
- [ ] ✅ Hamburger menu icon appears
- [ ] Click hamburger menu
- [ ] ✅ Mobile menu slides open
- [ ] ✅ All nav links accessible
- [ ] ✅ Projects show 1 column
- [ ] ✅ Cards stack vertically
- [ ] ✅ All buttons accessible
- [ ] ✅ Forms are usable

---

### 22. Dark Mode

**Test Dark Mode:**
- [ ] Click moon icon (top right)
- [ ] ✅ Entire site switches to dark theme
- [ ] ✅ Background is dark
- [ ] ✅ Text is light/readable
- [ ] ✅ Cards have dark background
- [ ] ✅ Borders are visible
- [ ] ✅ All colors adjusted
- [ ] Refresh page
- [ ] ✅ Dark mode persists
- [ ] Click sun icon
- [ ] ✅ Switches back to light mode
- [ ] Refresh
- [ ] ✅ Light mode persists

**Test Dark Mode on All Pages:**
- [ ] Home page - ✅
- [ ] Projects - ✅
- [ ] Project details - ✅
- [ ] Dashboard - ✅
- [ ] Profile - ✅
- [ ] All forms - ✅

---

### 23. Interactive Project Cards

**Test Card Interactions:**
- [ ] Go to Projects page
- [ ] Hover over project card
- [ ] ✅ Card lifts up (transform)
- [ ] ✅ Shadow increases
- [ ] ✅ Smooth transition
- [ ] Click anywhere on card
- [ ] ✅ Navigates to project details
- [ ] Go back
- [ ] Click "View Details" link
- [ ] ✅ Also navigates to details
- [ ] On projects page, if logged in:
  - [ ] Click bookmark icon
  - [ ] ✅ Icon fills immediately
  - [ ] ✅ No page reload

---

### 24. Form Validation

**Test Registration Validation:**
- [ ] Logout
- [ ] Go to Register
- [ ] Leave name empty, click submit
- [ ] ✅ Error: "All fields are required"
- [ ] Fill name, leave email empty
- [ ] ✅ Shows validation error
- [ ] Enter passwords that don't match
- [ ] ✅ Error: "Passwords do not match"
- [ ] Enter password less than 6 chars
- [ ] ✅ Error: "Password must be at least 6 characters"
- [ ] Try to register with existing email
- [ ] ✅ Error: "Email already registered"

**Test Login Validation:**
- [ ] Leave email empty
- [ ] ✅ Validation error
- [ ] Enter wrong password
- [ ] ✅ Error: "Invalid email or password"

**Test Project Creation Validation:**
- [ ] Login and go to Create Project
- [ ] Leave title empty, submit
- [ ] ✅ Error: "Please fill in all required fields"
- [ ] Fill only title, submit
- [ ] ✅ Error for missing description

---

### 25. Success/Error Messages

**Test Success Messages:**
- [ ] Register new user
- [ ] ✅ Green success message: "Registration successful!"
- [ ] Login
- [ ] ✅ Green success: "Welcome back, [Name]!"
- [ ] Create project
- [ ] ✅ Success: "Project created successfully!"
- [ ] Edit project
- [ ] ✅ Success: "Project updated successfully!"
- [ ] Accept join request
- [ ] ✅ Success: "[Name] added to team!"
- [ ] Update profile
- [ ] ✅ Success: "Profile updated successfully!"

**Test Error Messages:**
- [ ] Try wrong password
- [ ] ✅ Red error: "Invalid email or password"
- [ ] Try accessing project edit without permission
- [ ] ✅ Error: "You can only edit your own projects"
- [ ] Try joining project you own
- [ ] ✅ Error: "You cannot join your own project"

**Test Auto-Dismiss:**
- [ ] Trigger any success message
- [ ] Wait 5 seconds
- [ ] ✅ Message fades out automatically

---

## 🔍 Additional Tests

### Test My Requests Page
- [ ] As second user, go to "My Requests"
- [ ] ✅ Shows all sent requests
- [ ] ✅ Shows status (Pending/Accepted/Rejected)
- [ ] ✅ Shows when request was sent
- [ ] ✅ Shows your message
- [ ] ✅ "View Project" button works
- [ ] For accepted requests:
  - [ ] ✅ Shows "View Progress" button

### Test Join Requests Page (Incoming)
- [ ] As project owner, go to "Join Requests"
- [ ] ✅ Shows all pending requests for your projects
- [ ] ✅ Shows requester's name, email, message
- [ ] ✅ Shows skill match percentage
- [ ] ✅ Shows matching/missing skills
- [ ] ✅ "View Profile" button works
- [ ] ✅ Accept/Reject buttons work

### Test Dropdown Menu on All Pages
- [ ] Home page - ✅
- [ ] Dashboard - ✅
- [ ] Projects - ✅
- [ ] Profile - ✅
- [ ] Any other page - ✅
- [ ] Click outside to close - ✅

### Test Navigation Links
- [ ] All navbar links work - ✅
- [ ] All footer links work - ✅
- [ ] Breadcrumb links work - ✅
- [ ] "Back" buttons work - ✅
- [ ] Cancel buttons work - ✅

### Test Delete Functionality
- [ ] Delete project (with confirmation) - ✅
- [ ] Cannot delete others' projects - ✅
- [ ] Admin can delete any project - ✅
- [ ] Related data deleted (bookmarks, requests) - ✅

### Test Ownership & Permissions
- [ ] Can only edit own projects - ✅
- [ ] Can only delete own projects - ✅
- [ ] Cannot join own project - ✅
- [ ] Admin has extra permissions - ✅
- [ ] Team members can view progress - ✅
- [ ] Only owner can add milestones - ✅

---

## 📊 Final Verification

### Check All 25 Features Work:
1. ✅ User Authentication
2. ✅ Profile Management
3. ✅ Project CRUD
4. ✅ Browse Projects
5. ✅ Search Projects
6. ✅ Filter Projects
7. ✅ Project Details
8. ✅ Bookmark Projects
9. ✅ Send Join Requests
10. ✅ Accept/Reject Requests
11. ✅ Skill Match Percentage
12. ✅ Missing Skills Finder
13. ✅ Team Compatibility
14. ✅ Progress Tracker
15. ✅ Developer Portfolio
16. ✅ Notification System
17. ✅ Trending Projects
18. ✅ Readiness Score
19. ✅ Personalized Dashboard
20. ✅ Admin Dashboard
21. ✅ Responsive Design
22. ✅ Dark Mode
23. ✅ Interactive Cards
24. ✅ Form Validation
25. ✅ Success/Error Messages

### Check All 17 Pages:
1. ✅ home.ejs
2. ✅ login.ejs
3. ✅ register.ejs
4. ✅ projects.ejs
5. ✅ project-details.ejs
6. ✅ create-project.ejs
7. ✅ edit-project.ejs
8. ✅ dashboard.ejs
9. ✅ my-projects.ejs
10. ✅ join-requests.ejs
11. ✅ my-requests.ejs
12. ✅ profile.ejs
13. ✅ portfolio.ejs
14. ✅ saved-projects.ejs
15. ✅ notifications.ejs
16. ✅ project-progress.ejs
17. ✅ admin-dashboard.ejs

### Final Checks:
- [ ] No console errors in browser
- [ ] No server errors in terminal
- [ ] All pages load quickly
- [ ] All images/icons display
- [ ] CSS loads properly on all pages
- [ ] JavaScript works on all pages
- [ ] Database saves all data
- [ ] Session persists across pages
- [ ] Can logout and login again
- [ ] Data persists after server restart

---

## 🎉 Testing Complete!

**Total Features Tested:** 25/25  
**Total Pages Tested:** 17/17  
**All Working:** ✅ Yes / ❌ No  

**Notes/Issues Found:**
_______________________________________
_______________________________________
_______________________________________

**Overall Rating:** ⭐⭐⭐⭐⭐

---

## Quick Test Script (5 Minutes)

If you want to quickly verify everything works:

1. Register → Login → Update Profile (add skills)
2. Create Project → Edit Project → View Details
3. Bookmark Project → View Saved Projects
4. Register Second User → Send Join Request
5. Accept Request → View Progress → Add Milestones
6. Check Notifications → Check Dashboard
7. Test Dark Mode → Test Responsive (resize window)
8. Test Dropdown Menu on different pages
9. Logout → Login again

**If all above work, ALL 25 features are working! ✅**
