## Quick Start

### Installation Commands

#### Frontend
```bash
cd client
npm install
cp .env.example .env
```

#### Backend
```bash
cd server
npm install
cp .env.example .env
```

### Run Commands

#### Terminal 1 - Start Frontend
```bash
cd client
npm run dev
```
- Runs on: http://localhost:3000

#### Terminal 2 - Start Backend
```bash
cd server
npm run dev
```
- Runs on: http://localhost:5000

#### Terminal 3 - MongoDB
```bash
mongod
```
- Connects to: mongodb://localhost:27017/mobidrag_portal

### Access Application
Open browser: **http://localhost:3000**

### Demo Login
```
Email: test@mobidrag.com
Password: password123
```

## Build Commands

### Frontend Production Build
```bash
cd client
npm run build
npm run preview
```

### Backend Production Start
```bash
cd server
npm start
```

## Project Structure

**Frontend:**
- `src/pages/` - Home, Login, Dashboard pages
- `src/components/` - Navbar and reusable components
- `src/services/api.js` - Axios API configuration
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration

**Backend:**
- `src/routes/` - API route handlers
- `src/controllers/` - Business logic
- `src/models/` - MongoDB schemas
- `src/middleware/` - Authentication middleware
- `src/server.js` - Express server configuration

## Created Files

### Frontend Files
- ✅ React components (Home, Login, Dashboard)
- ✅ Navbar with navigation
- ✅ API service with Axios
- ✅ Tailwind CSS setup
- ✅ Vite configuration
- ✅ React Router setup

### Backend Files
- ✅ Express server with CORS
- ✅ JWT authentication
- ✅ MongoDB User model with bcrypt
- ✅ Auth routes (register, login)
- ✅ Dashboard routes
- ✅ Auth middleware
- ✅ Controllers for business logic

## Environment Files
- ✅ `.env.example` in client/
- ✅ `.env.example` in server/

---

**Step 1 Complete** ✅
Full-stack project structure ready for development.
