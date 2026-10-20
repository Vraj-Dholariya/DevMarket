# DevMarket - Quick Test (10 Minutes)

## ✅ Quick Feature Verification

### Step 1: Setup (1 min)
```
1. Start MongoDB
2. Run: npm start
3. Open: http://localhost:3000
```

### Step 2: User & Profile (2 min)
```
□ Register: test@test.com / password123
□ Login
□ Profile → Add skills: JavaScript, React, Node.js
□ Click Update → Success message appears
```

### Step 3: Projects (3 min)
```
□ Create Project:
  - Title: E-Commerce Platform
  - Description: Online shopping platform
  - Category: Web Development
  - Difficulty: Intermediate
  - Technologies: React, Node.js
  - Skills: JavaScript, React, MongoDB
  
□ Browse Projects → Your project appears
□ Search "ecommerce" → Filters correctly
□ Click project → View details
□ Bookmark project → Icon changes
□ Edit project → Change description → Save
```

### Step 4: Collaboration (2 min)
```
□ Open Incognito window
□ Register: dev2@test.com / password123
□ Profile → Add skills: Python, Django
□ Browse → Find first user's project
□ Click "Request to Join" → Send request

□ Back to first user
□ Join Requests → See dev2's request
□ View skill match → Shows percentage
□ Click Accept → Success
□ Project details → dev2 in team
```

### Step 5: Progress & Features (2 min)
```
□ Project details → View Progress
□ Add 3 milestones
□ Check 1 milestone → Progress updates
□ Notifications → Check unread
□ Dashboard → Shows stats
□ Dark Mode → Toggle works
□ Dropdown menu → Works on all pages
□ Resize window → Responsive works
```

## ✅ If All Above Work = All 25 Features Work!

---

## Feature-to-Test Mapping

| Feature | Quick Test |
|---------|-----------|
| 1-3: Auth & Profile | Step 2 |
| 4-8: Projects & Browse | Step 3 |
| 9-10: Join Requests | Step 4 |
| 11-13: Skill Match | Step 4 (skill match shown) |
| 14: Progress Tracker | Step 5 |
| 15-16: Portfolio & Notifications | Step 5 |
| 17-20: Dashboard & Admin | Step 5 |
| 21-25: UI Features | Step 5 |

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| 500 Error | Check MongoDB is running |
| Dropdown doesn't work | Refresh browser |
| CSS not loading | Run: npx tailwindcss -i ./public/css/input.css -o ./public/css/style.css |
| Port in use | Stop other node processes |

---

## One-Liner Tests

```bash
# Test Authentication
Register → Login → Logout → Login ✅

# Test Projects
Create → Edit → Delete → Confirm ✅

# Test Collaboration  
Request → Accept → Team updated ✅

# Test Progress
Add milestone → Check → Progress updates ✅

# Test UI
Dark mode → Responsive → Dropdown ✅
```

---

## Pass Criteria

✅ Can register and login  
✅ Can create and edit project  
✅ Can search and filter  
✅ Can bookmark projects  
✅ Can send and accept requests  
✅ Skill match shows correctly  
✅ Progress tracker works  
✅ Notifications appear  
✅ Dark mode works  
✅ Responsive on mobile  

**All 10 pass = 🎉 All features working!**
