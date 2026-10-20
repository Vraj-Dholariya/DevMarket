# Quick Setup Guide for DevMarket

Follow these steps to get DevMarket running on your machine.

## Step 1: Install MongoDB

### Option A: Local MongoDB
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. MongoDB will run on `mongodb://localhost:27017`

### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get your connection string
4. Update `.env` file with your connection string

## Step 2: Configure Environment Variables

Open the `.env` file and update:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/devmarket
SESSION_SECRET=change-this-to-a-random-secret-key
NODE_ENV=development
```

**Important**: Change the `SESSION_SECRET` to a random string for security.

## Step 3: Install Dependencies (Already Done)

Dependencies are already installed. If you need to reinstall:
```bash
npm install
```

## Step 4: Build CSS (Already Done)

CSS is already built. If you need to rebuild:
```bash
npx tailwindcss -i ./public/css/input.css -o ./public/css/style.css
```

## Step 5: Start the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

## Step 6: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## Step 7: Create Your First Account

1. Click "Sign Up" in the navigation
2. Fill in your details
3. After registration, you'll be redirected to login
4. Login with your credentials

## Step 8: Create a Project

1. After logging in, click "Create Project"
2. Fill in project details
3. Add technologies and required skills (comma-separated)
4. Submit to create your first project

## Creating an Admin Account

To access the admin dashboard:

1. Register a normal account first
2. Open MongoDB (using MongoDB Compass or command line)
3. Find your user in the `users` collection
4. Set `isAdmin: true` for that user

Using MongoDB Shell:
```javascript
use devmarket
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { isAdmin: true } }
)
```

Then visit: `http://localhost:3000/admin`

## Testing All Features

### Basic Features:
- ✅ Register a new user
- ✅ Login and logout
- ✅ Edit your profile and add skills
- ✅ Create a project
- ✅ Browse and search projects
- ✅ View project details
- ✅ Bookmark a project

### Collaboration Features:
- ✅ Send a join request to a project
- ✅ As project owner, accept/reject requests
- ✅ Add milestones to your project
- ✅ Track project progress

### Advanced Features:
- ✅ Check skill match percentage on project details
- ✅ View missing skills
- ✅ Check project readiness score
- ✅ View notifications
- ✅ View user portfolios
- ✅ Toggle dark mode

## Common Issues

### "Cannot connect to MongoDB"
- Make sure MongoDB is running
- Check your MONGODB_URI in .env
- For Atlas, verify your IP is whitelisted

### "Port 3000 already in use"
- Change PORT in .env to 3001 or another available port

### "CSS not loading"
- Run: `npx tailwindcss -i ./public/css/input.css -o ./public/css/style.css`
- Check if `public/css/style.css` exists

### "Module not found"
- Run: `npm install`
- Delete `node_modules` and `package-lock.json`, then run `npm install` again

## Development Tips

### Watch CSS Changes
To automatically rebuild CSS when you make changes:
```bash
npm run build:css
```
This will watch for changes in your CSS files.

### Auto-restart Server
Use nodemon for automatic server restart:
```bash
npm run dev
```

### Check MongoDB Data
Use MongoDB Compass (free GUI tool) to view and edit your database:
https://www.mongodb.com/products/compass

## Project Structure

```
DevMarket/
├── config/          # Database connection
├── middleware/      # Auth & admin middleware
├── models/          # MongoDB schemas
├── routes/          # Express routes
├── utils/           # Helper functions
├── public/          # Static files
│   ├── css/         # Tailwind CSS
│   └── js/          # Client-side JavaScript
├── views/           # EJS templates
│   ├── partials/    # Reusable components
│   └── *.ejs        # Page templates
├── vue/             # Vue.js components
└── server.js        # App entry point
```

## All Features Checklist

### Core Features (10):
1. ✅ User registration
2. ✅ User login/logout
3. ✅ Profile management
4. ✅ Project CRUD operations
5. ✅ Browse projects
6. ✅ Search projects
7. ✅ Filter projects
8. ✅ Project details page
9. ✅ Bookmark projects
10. ✅ Join requests

### Advanced Features (15):
11. ✅ Skill match percentage
12. ✅ Missing skills finder
13. ✅ Team compatibility
14. ✅ Project progress tracker
15. ✅ Developer portfolio
16. ✅ Notification system
17. ✅ Trending projects
18. ✅ Project readiness score
19. ✅ Personalized dashboard
20. ✅ Admin dashboard
21. ✅ Responsive design
22. ✅ Dark mode
23. ✅ Interactive cards
24. ✅ Form validation
25. ✅ Success/error messages

## Need Help?

- Check the main README.md for detailed documentation
- Review the code comments in each file
- All functions are kept simple and beginner-friendly

Enjoy building with DevMarket! 🚀
