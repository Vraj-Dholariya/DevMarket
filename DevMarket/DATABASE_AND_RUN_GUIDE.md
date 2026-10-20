# DevMarket - Database Connection & Run Guide

## 1. Prerequisites
- Node.js 18+ (`node -v`)
- Either MongoDB Community Server (local) OR a free MongoDB Atlas account
- MongoDB Compass (optional GUI)

## 2. Install the project
```
cd DevMarket
npm install
```

## 3. Configure `.env`
Open `.env`. Set `SESSION_SECRET` to any long random text. Then pick ONE database option.

### Option A - Local MongoDB
1. Install MongoDB Community Server; make sure the service is running (Windows: Services -> MongoDB Server).
2. `.env`: `MONGODB_URI=mongodb://localhost:27017/devmarket`
3. Compass: New Connection -> `mongodb://localhost:27017` -> Connect.

### Option B - MongoDB Atlas
1. cloud.mongodb.com -> create a free M0 cluster.
2. Database Access -> Add user (username + password).
3. Network Access -> Add your current IP (for testing, 0.0.0.0/0 is allowed but unsafe long-term).
4. Connect -> Drivers -> copy the connection string.
5. `.env` - comment out Option A, enable Option B, and insert your user/password. Keep `/devmarket` before the `?`.
   Special characters in the password (@ # / :) must be URL-encoded (e.g. @ -> %40).
6. Compass: paste the same string -> Connect.

### Moving existing local data to Atlas (optional)
```
mongodump --uri="mongodb://localhost:27017/devmarket" --out=./dump
mongorestore --uri="<your Atlas URI>" --nsInclude="devmarket.*" ./dump
```
(Or export/import each collection as JSON in Compass.)

## 4. Test the connection
```
npm run test:db
```
Expect: `OK - connected to database: devmarket`

## 5. Run the project
```
npm run dev      # auto-restart (nodemon)
# or
npm start
```
Console should show `MongoDB connected successfully (local MongoDB | MongoDB Atlas ...)` and the server URL.
Open http://localhost:3000

## 6. First use
1. Register a user. Collections (`users`, `projects`, `sessions`, ...) appear in Compass after first use.
2. Refresh Compass to see the data.
3. To make an admin, in Compass open `users`, edit your document and set `isAdmin: true` (check models/User.js for the exact field).

## 7. Tailwind CSS (only if you edit styles)
```
npm run build:css
```

## Troubleshooting
| Problem | Fix |
|---|---|
| ECONNREFUSED 127.0.0.1:27017 | Local MongoDB not running - start the service |
| Atlas: "Server selection timed out" | IP not whitelisted in Network Access |
| Atlas: "bad auth" | Wrong user/password, or password not URL-encoded |
| Logged out on restart / session errors | Check `MONGODB_URI` is valid; sessions are stored in the same DB |
| Port in use | Change `PORT` in `.env` |

## Atlas error: `querySrv ECONNREFUSED _mongodb._tcp.<cluster>.mongodb.net`
Your network/DNS refuses SRV lookups. The code now forces Google/Cloudflare DNS (8.8.8.8, 1.1.1.1) for Atlas URIs.
If it still fails, try in order:
1. Change Windows DNS: Settings -> Network -> your adapter -> DNS -> Manual: 8.8.8.8 and 1.1.1.1, then `ipconfig /flushdns`.
2. Turn off VPN / try a phone hotspot to confirm it is the network.
3. In Atlas: Connect -> Drivers -> choose Node.js version "2.2.12 or later" to get the long
   `mongodb://host1:27017,host2:27017,host3:27017/...` string (no SRV needed) and use it as MONGODB_URI.
