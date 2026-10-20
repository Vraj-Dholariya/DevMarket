# DevMarket - Architecture & Flow Diagrams

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     HTML     │  │   Tailwind   │  │   Vue.js     │         │
│  │   (EJS)      │  │     CSS      │  │  Components  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                           │                                      │
│                    HTTP Requests                                │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      EXPRESS SERVER                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     server.js                            │  │
│  │  • Loads environment (.env)                              │  │
│  │  • Connects to database                                  │  │
│  │  • Sets up middleware                                    │  │
│  │  • Registers routes                                      │  │
│  │  • Starts listening                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│  ┌─────────────────────────┼─────────────────────────────────┐ │
│  │         MIDDLEWARE      │                                 │ │
│  │  ┌──────────────┐  ┌────┴──────┐  ┌─────────────────┐   │ │
│  │  │   Session    │  │   Flash   │  │   Auth Check    │   │ │
│  │  │  (login)     │  │ (messages)│  │  (permission)   │   │ │
│  │  └──────────────┘  └───────────┘  └─────────────────┘   │ │
│  └────────────────────────┼───────────────────────────────────┘ │
│                            │                                    │
│  ┌─────────────────────────┼─────────────────────────────────┐ │
│  │          ROUTES         │                                 │ │
│  │  ┌──────────────┐  ┌────┴──────┐  ┌─────────────────┐   │ │
│  │  │    Auth      │  │  Project  │  │     User        │   │ │
│  │  │ /register    │  │ /projects │  │  /dashboard     │   │ │
│  │  │ /login       │  │ /create   │  │  /profile       │   │ │
│  │  └──────────────┘  └───────────┘  └─────────────────┘   │ │
│  └────────────────────────┼───────────────────────────────────┘ │
│                            │                                    │
│  ┌─────────────────────────┼─────────────────────────────────┐ │
│  │         MODELS          │                                 │ │
│  │  ┌──────────────┐  ┌────┴──────┐  ┌─────────────────┐   │ │
│  │  │     User     │  │  Project  │  │    Bookmark     │   │ │
│  │  │  • name      │  │  • title  │  │  • user_id      │   │ │
│  │  │  • email     │  │  • owner  │  │  • project_id   │   │ │
│  │  │  • password  │  │  • skills │  │                 │   │ │
│  │  └──────────────┘  └───────────┘  └─────────────────┘   │ │
│  └────────────────────────┼───────────────────────────────────┘ │
└────────────────────────────┼─────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    users     │  │   projects   │  │  bookmarks   │         │
│  │  collection  │  │  collection  │  │  collection  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Diagrams

### 1. User Registration Flow

```
┌────────┐     1. GET /register     ┌──────────────┐
│ Browser│ ────────────────────────→│    Server    │
│        │                          │              │
│        │  2. Render register.ejs  │              │
│        │←────────────────────────│              │
└────────┘                          └──────────────┘
    │                                      
    │ 3. User fills form                   
    │    and clicks Submit                 
    │                                      
    │     4. POST /register               
    │     (name, email, password)         
    ↓                                      
┌────────┐                          ┌──────────────┐
│ Browser│ ────────────────────────→│ authRoutes   │
│        │                          │    .js       │
│        │                          └──────┬───────┘
│        │                                 │
│        │                          5. Validate data
│        │                                 │
│        │                          ┌──────▼───────┐
│        │                          │  User Model  │
│        │                          │   .save()    │
│        │                          └──────┬───────┘
│        │                                 │
│        │                          6. Hash password
│        │                                 │
│        │                          ┌──────▼───────┐
│        │                          │   MongoDB    │
│        │                          │   Insert     │
│        │                          └──────────────┘
│        │                                 
│        │  7. Redirect to /login          
│        │     with success message        
│        │←────────────────────────        
└────────┘                                  
```

---

### 2. View Project Details Flow

```
User clicks project card
         │
         ▼
┌─────────────────────────┐
│  GET /projects/:id      │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   projectRoutes.js      │
│                         │
│ 1. Project.findById()   │──→ MongoDB
│    .populate('owner')   │
│    .populate('team')    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 2. Increment viewCount  │──→ MongoDB
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 3. If user logged in:   │
│    - Get user from DB   │──→ MongoDB
│    - Calculate skill    │
│      match percentage   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 4. Calculate readiness  │
│    score                │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ 5. Render               │
│    project-details.ejs  │
│    with all data        │
└────────┬────────────────┘
         │
         ▼
    Browser displays page
    with Vue.js skill match
```

---

### 3. Join Request Flow (Two Users)

```
USER A (Project Owner)              USER B (Wants to Join)
      │                                     │
      │ Creates project                     │
      ▼                                     │
┌──────────────┐                           │
│   Project    │                           │
│   created    │                           │
└──────────────┘                           │
      │                                     │
      │◄─────────────────────┐             │
      │                      │             │
      │                      │  Finds      │
      │                      │  project    │
      │                      │             ▼
      │                      │      ┌──────────────┐
      │                      │      │ Clicks       │
      │                      │      │ "Request to  │
      │                      │      │  Join"       │
      │                      │      └──────┬───────┘
      │                      │             │
      │                      │             │ POST /projects/:id/join
      │                      │             │
      │                      │             ▼
      │                      │      ┌──────────────┐
      │                      │      │ JoinRequest  │
      │                      └──────│   created    │
      │                             └──────┬───────┘
      │                                    │
      │ Gets notification                  │
      ▼                                    │
┌──────────────┐                          │
│ "User B      │                          │
│  wants to    │◄─────────────────────────┘
│  join"       │
└──────┬───────┘
       │
       │ Goes to Join Requests
       ▼
┌──────────────┐
│ Sees         │
│ - User B     │
│ - Message    │
│ - Skills     │
│ - Match %    │
└──────┬───────┘
       │
       │ Clicks Accept
       ▼
┌──────────────┐
│ 1. Update    │──→ MongoDB
│    request   │    status = Accepted
│    status    │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 2. Add User B│──→ MongoDB
│    to team   │    teamMembers.push()
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ 3. Create    │──→ MongoDB
│    notif for │    Notification
│    User B    │
└──────────────┘
       │
       │
       │                              USER B
       │                                  │
       └─────────────────────────────────→│
                                          ▼
                                   ┌──────────────┐
                                   │ Gets notif:  │
                                   │ "Accepted!"  │
                                   └──────────────┘
```

---

## 📁 File Structure Flow

```
When user visits /projects/:id

server.js
    │
    ├─→ Loads projectRoutes.js
    │
    └─→ projectRoutes.js
            │
            ├─→ Uses middleware/auth.js (check login)
            │
            ├─→ Calls Project model (models/Project.js)
            │       │
            │       └─→ Queries MongoDB
            │
            ├─→ Calls utils/skillMatch.js (calculate %)
            │
            └─→ Renders views/project-details.ejs
                    │
                    ├─→ Includes views/partials/navbar.ejs
                    │
                    ├─→ Includes views/partials/footer.ejs
                    │
                    ├─→ Loads public/css/style.css
                    │
                    ├─→ Loads public/js/main.js
                    │
                    └─→ Loads vue/skill-match.js
```

---

## 🔐 Authentication Flow

```
┌────────────────────────────────────────────────────────────┐
│                      Session Flow                          │
└────────────────────────────────────────────────────────────┘

1. User logs in
   │
   ▼
┌──────────────────┐
│ POST /login      │
│                  │
│ 1. Find user     │──→ MongoDB users collection
│ 2. Check pwd     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Create session   │
│                  │
│ req.session = {  │──→ Stored in MongoDB
│   userId: '123'  │    sessions collection
│   userName: 'X'  │
│   isAdmin: false │
│ }                │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Set cookie       │
│                  │
│ connect.sid=abc  │──→ Sent to browser
└────────┬─────────┘
         │
         ▼
    Browser stores cookie
    
    
2. Subsequent requests

Browser
   │ Every request includes cookie
   │ Cookie: connect.sid=abc
   ▼
Server
   │
   ├─→ express-session reads cookie
   │
   ├─→ Looks up session in MongoDB
   │
   ├─→ Loads session data into req.session
   │
   └─→ Middleware can check req.session.userId
```

---

## 🎨 Frontend Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    Static Assets (public/)                  │
└────────────────────────────────────────────────────────────┘

CSS (Tailwind)
   │
   ├─→ input.css (source)
   │      │
   │      └─→ Processed by Tailwind
   │             │
   │             └─→ style.css (output)
   │                    │
   │                    └─→ Loaded in <head>
   │
JavaScript
   │
   ├─→ main.js
   │      │
   │      ├─→ Dark mode toggle
   │      ├─→ Bookmark function
   │      └─→ DOM manipulation
   │
   └─→ vue/ components
          │
          ├─→ skill-match.js
          │      │
          │      └─→ Reactive UI for skills
          │
          └─→ progress-tracker.js
                 │
                 └─→ Milestone management


┌────────────────────────────────────────────────────────────┐
│                Templates (views/)                           │
└────────────────────────────────────────────────────────────┘

partials/
   │
   ├─→ navbar.ejs ──┐
   ├─→ footer.ejs ──┤
   └─→ messages.ejs ┤
                    │
pages/              │ Included in every page
   │                │
   ├─→ home.ejs ────┤
   ├─→ login.ejs ───┤
   └─→ dashboard.ejs┘
```

---

## 🗄️ Database Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                  MongoDB Collections                        │
└─────────────────────────────────────────────────────────────┘

users
┌────────────────────┐
│ _id: ObjectId      │◄─────┐
│ name: "John"       │      │
│ email: "..."       │      │ Referenced by
│ password: "hash"   │      │
│ skills: []         │      │
└────────────────────┘      │
         ▲                  │
         │ owner            │
         │                  │
projects │                  │
┌────────┴───────────┐      │
│ _id: ObjectId      │      │
│ title: "Project"   │      │
│ owner: ObjectId ───┘      │
│ teamMembers: [            │
│   ObjectId ───────────────┘
│ ]                  │
│ requiredSkills: [] │
└────────────────────┘
         ▲
         │ project
         │
bookmarks
┌────────┴───────────┐
│ _id: ObjectId      │
│ user: ObjectId     │─────→ users
│ project: ObjectId ─┘
└────────────────────┘

joinRequests
┌────────────────────┐
│ _id: ObjectId      │
│ user: ObjectId     │─────→ users
│ project: ObjectId  │─────→ projects
│ status: "Pending"  │
│ message: "..."     │
└────────────────────┘

notifications
┌────────────────────┐
│ _id: ObjectId      │
│ user: ObjectId     │─────→ users
│ type: "..."        │
│ message: "..."     │
│ read: false        │
└────────────────────┘
```

---

## 🚀 Data Flow Example: Creating a Project

```
Step 1: User Input
┌────────────────────┐
│   Browser Form     │
│                    │
│ Title: "My App"    │
│ Description: "..." │
│ Category: "Web"    │
│ Skills: "JS,React" │
│                    │
│ [Create Project]   │
└─────────┬──────────┘
          │ Click
          ▼

Step 2: HTTP Request
┌────────────────────┐
│ POST /projects     │
│                    │
│ Body: {            │
│   title: "My App"  │
│   description: ... │
│   category: "Web"  │
│   skills: "JS..."  │
│ }                  │
└─────────┬──────────┘
          │
          ▼

Step 3: Route Handler
┌────────────────────┐
│ projectRoutes.js   │
│                    │
│ 1. Get form data   │
│ 2. Validate        │
│ 3. Split skills    │
│    "JS,React"      │
│    → ["JS","React"]│
└─────────┬──────────┘
          │
          ▼

Step 4: Create Model
┌────────────────────┐
│ new Project({      │
│   title,           │
│   description,     │
│   category,        │
│   requiredSkills,  │
│   owner: userId    │
│ })                 │
└─────────┬──────────┘
          │
          ▼

Step 5: Save to DB
┌────────────────────┐
│ project.save()     │
│                    │
│ MongoDB:           │
│ {                  │
│   _id: "abc123"    │
│   title: "My App"  │
│   owner: "user123" │
│   ...              │
│ }                  │
└─────────┬──────────┘
          │
          ▼

Step 6: Response
┌────────────────────┐
│ Redirect           │
│ /projects/abc123   │
│                    │
│ with success msg   │
└─────────┬──────────┘
          │
          ▼
    Browser navigates
    to project details
```

---

## 💡 Key Concepts

### MVC Pattern
```
Model      →  Database structure & logic
View       →  What user sees (EJS)
Controller →  Request handling (Routes)
```

### Middleware Chain
```
Request → Session → Flash → Auth → Route → Response
          ↓         ↓        ↓      ↓
       Check ID   Get msgs  Check  Handle
       from        for      login  request
       cookie      display
```

### Population (Joining Data)
```
Without populate:
{
  owner: "507f1f77bcf86cd799439011"  // Just ID
}

With populate:
{
  owner: {
    _id: "507f1f77bcf86cd799439011",
    name: "John Doe",
    email: "john@example.com"
  }
}
```

This architecture makes DevMarket:
- **Scalable** - Easy to add features
- **Maintainable** - Clear separation of concerns
- **Secure** - Middleware checks permissions
- **Fast** - Efficient database queries
