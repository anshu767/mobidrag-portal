╔════════════════════════════════════════════════════════════════════════════╗
║         MobiDrag Partner Portal - Installation & Run Commands              ║
╚════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────────────────────
│ STEP 1: CLONE/NAVIGATE TO PROJECT
└─────────────────────────────────────────────────────────────────────────────

cd c:\mobidrag-portal


┌─────────────────────────────────────────────────────────────────────────────
│ STEP 2: SETUP FRONTEND (React + Vite)
└─────────────────────────────────────────────────────────────────────────────

cd client
npm install
cp .env.example .env

→ Frontend installed successfully!


┌─────────────────────────────────────────────────────────────────────────────
│ STEP 3: SETUP BACKEND (Express + Node.js)
└─────────────────────────────────────────────────────────────────────────────

cd ../server
npm install
cp .env.example .env

→ Backend installed successfully!


┌─────────────────────────────────────────────────────────────────────────────
│ STEP 4: INSTALL MONGODB (Optional - for local development)
└─────────────────────────────────────────────────────────────────────────────

Download MongoDB Community Edition:
https://www.mongodb.com/try/download/community

Or use MongoDB Atlas (Cloud):
https://www.mongodb.com/cloud/atlas


┌─────────────────────────────────────────────────────────────────────────────
│ STEP 5: RUN THE APPLICATION (Open 3 terminals)
└─────────────────────────────────────────────────────────────────────────────

TERMINAL 1 - Frontend (http://localhost:3000):
─────────────────────────────────────────────
cd client
npm run dev

TERMINAL 2 - Backend (http://localhost:5000):
──────────────────────────────────────────────
cd server
npm run dev

TERMINAL 3 - MongoDB (if running locally):
───────────────────────────────────────────
mongod


┌─────────────────────────────────────────────────────────────────────────────
│ STEP 6: ACCESS APPLICATION
└─────────────────────────────────────────────────────────────────────────────

Open Browser: http://localhost:3000

Demo Credentials:
  Email:    test@mobidrag.com
  Password: password123


╔════════════════════════════════════════════════════════════════════════════╗
║                         BUILD FOR PRODUCTION                              ║
╚════════════════════════════════════════════════════════════════════════════╝

Frontend Build:
───────────────
cd client
npm run build
npm run preview

Backend Production:
───────────────────
cd server
npm start


╔════════════════════════════════════════════════════════════════════════════╗
║                            ENVIRONMENT SETUP                              ║
╚════════════════════════════════════════════════════════════════════════════╝

client/.env:
────────────
VITE_API_BASE_URL=http://localhost:5000/api


server/.env:
────────────
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mobidrag_portal
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development


╔════════════════════════════════════════════════════════════════════════════╗
║                             PROJECT FEATURES                              ║
╚════════════════════════════════════════════════════════════════════════════╝

✅ User Authentication (JWT)
✅ Password Encryption (bcrypt)
✅ Protected Routes
✅ Responsive Design (Tailwind CSS)
✅ API Error Handling
✅ CORS Enabled
✅ Environment Configuration
✅ Modern React Hooks
✅ Express Middleware
✅ MongoDB Integration Ready


╔════════════════════════════════════════════════════════════════════════════╗
║                              API ENDPOINTS                                ║
╚════════════════════════════════════════════════════════════════════════════╝

Authentication:
  POST   http://localhost:5000/api/auth/register
  POST   http://localhost:5000/api/auth/login

Dashboard:
  GET    http://localhost:5000/api/dashboard
  PUT    http://localhost:5000/api/dashboard/profile

Health:
  GET    http://localhost:5000/api/health


╔════════════════════════════════════════════════════════════════════════════╗
║                              PROJECT PAGES                                ║
╚════════════════════════════════════════════════════════════════════════════╝

Home Page:
  URL: http://localhost:3000
  Status: Public

Login Page:
  URL: http://localhost:3000/login
  Status: Public (Redirects to dashboard if logged in)

Dashboard:
  URL: http://localhost:3000/dashboard
  Status: Protected (Requires login)


╔════════════════════════════════════════════════════════════════════════════╗
║                          TROUBLESHOOTING                                   ║
╚════════════════════════════════════════════════════════════════════════════╝

Port 3000 already in use:
  npm run dev -- --port 3001

Port 5000 already in use:
  Change PORT in server/.env

MongoDB connection error:
  Check MONGODB_URI in server/.env
  Ensure MongoDB is running: mongod

CORS errors:
  Check frontend URL in server/src/server.js
  Ensure VITE_API_BASE_URL is correct in client/.env

Clear node_modules and reinstall:
  rm -r node_modules
  npm install


╔════════════════════════════════════════════════════════════════════════════╗
║                         STEP 1 SETUP COMPLETE ✅                          ║
║              Ready for development and testing!                            ║
╚════════════════════════════════════════════════════════════════════════════╝
