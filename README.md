# DevMarket - Developer Project Marketplace

DevMarket is a full-stack web application where developers can discover projects, find teammates, showcase skills, and collaborate on exciting ideas.

## Features

✨ **Core Features**
- User authentication (register, login, logout)
- Developer profile management
- Project creation and management
- Browse, search, and filter projects
- Bookmark/save projects
- Join project requests
- Accept/reject team member requests

🎯 **Advanced Features**
- Skill-based match percentage
- Missing skills finder
- Team compatibility analysis
- Project progress tracker with milestones
- Developer portfolio
- Notification system
- Trending projects
- Project readiness score
- Personalized dashboard
- Admin dashboard

🎨 **UI Features**
- Responsive design (mobile, tablet, desktop)
- Dark mode
- Interactive project cards
- Form validation
- Success and error messages

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript, EJS, Vue.js, Tailwind CSS, Alpine.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: Session-based with bcryptjs

## Prerequisites

Before running this project, make sure you have:

- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone or download the project**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Edit the `.env` file and update the values:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/devmarket
   SESSION_SECRET=your-secret-key-change-this-in-production
   NODE_ENV=development
   ```

   **For MongoDB Atlas:**
   Replace `MONGODB_URI` with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/devmarket
   ```

4. **Build Tailwind CSS**
   ```bash
   npm run build:css
   ```

## Running the Application

1. **Make sure MongoDB is running** (if using local MongoDB)
   ```bash
   mongod
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Or start the production server**
   ```bash
   npm start
   ```

4. **Open your browser and visit**
   ```
   http://localhost:3000
   ```

## Creating an Admin User

By default, all users are regular users. To make a user an admin:

1. Register a new user
2. Connect to MongoDB
3. Update the user document:
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { isAdmin: true } }
   )
   ```

## Project Structure

```
devmarket/
├── config/          # Database configuration
├── middleware/      # Authentication and admin middleware
├── models/          # MongoDB models
├── routes/          # Express routes
├── utils/           # Utility functions
├── public/          # Static files (CSS, JS, images)
├── views/           # EJS templates
│   ├── partials/    # Reusable components
│   └── *.ejs        # Page templates
├── vue/             # Vue.js components
├── server.js        # Application entry point
└── .env             # Environment variables
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run build:css` - Build Tailwind CSS with watch mode

## Features Overview

### User Features
- Register and login with email/password
- Create and manage project profiles
- Add skills to profile
- Browse and search projects
- Bookmark favorite projects
- Send join requests to projects
- Track project progress with milestones

### Project Owner Features
- Create, edit, and delete projects
- Accept or reject join requests
- Manage team members
- Track project milestones and progress
- View skill compatibility of applicants

### Admin Features
- View all users and projects
- Delete inappropriate content
- Monitor platform statistics

### Smart Features
- **Skill Match Percentage**: Automatically calculates how well a developer's skills match project requirements
- **Missing Skills Finder**: Shows which skills need to be learned
- **Project Readiness Score**: Evaluates how well-defined a project is
- **Trending Projects**: Highlights popular projects based on bookmarks and activity

## API Endpoints

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### Projects
- `GET /projects` - Browse all projects
- `GET /projects/:id` - View project details
- `POST /projects` - Create project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### User
- `GET /dashboard` - User dashboard
- `GET /profile` - View/edit profile
- `POST /profile` - Update profile
- `GET /portfolio/:id` - View user portfolio

### Requests
- `POST /projects/:id/join` - Send join request
- `GET /join-requests` - View incoming requests
- `GET /my-requests` - View sent requests
- `POST /requests/:id/accept` - Accept request
- `POST /requests/:id/reject` - Reject request

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check the `MONGODB_URI` in `.env`
- For MongoDB Atlas, check your IP whitelist

### Port Already in Use
- Change the `PORT` in `.env` to another port (e.g., 3001)

### CSS Not Loading
- Run `npm run build:css` to compile Tailwind CSS
- Check if `public/css/style.css` exists

### Session Issues
- Clear browser cookies
- Update `SESSION_SECRET` in `.env`

## Contributing

This is a student project. Feel free to fork and modify for your own learning purposes.

## License

ISC

## Support

For issues or questions, please check the code comments and documentation within the project files.
