# MobiDrag Partner Portal - Step 1 Setup

Full-stack web application for partner delivery management.

## Project Structure

```
mobidrag-portal/
├── client/                 # React.js frontend (Vite)
│   ├── src/
│   │   ├── pages/         # Home, Login, Dashboard pages
│   │   ├── components/    # Navbar, UI components
│   │   ├── services/      # API calls (Axios)
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── index.html
│
└── server/                 # Node.js + Express backend
    ├── src/
    │   ├── routes/        # API routes (auth, dashboard)
    │   ├── controllers/   # Business logic
    │   ├── models/        # MongoDB schemas
    │   ├── middleware/    # Auth middleware
    │   └── server.js      # Main server file
    ├── package.json
    └── .env.example
```

## Tech Stack

### Frontend
- **React.js 18** - UI library
- **Vite** - Fast build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

## Installation

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Backend runs on: `http://localhost:5000`

### Environment Variables

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mobidrag_portal
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Application

### Terminal 1 - Frontend
```bash
cd client
npm run dev
```

### Terminal 2 - Backend
```bash
cd server
npm run dev
```

### Terminal 3 - MongoDB (if running locally)
```bash
mongod
```

Then open: `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new partner
- `POST /api/auth/login` - Login partner

### Dashboard
- `GET /api/dashboard` - Get dashboard data (protected)
- `PUT /api/dashboard/profile` - Update profile (protected)

### Health Check
- `GET /api/health` - Server status

## Demo Credentials

```
Email: test@mobidrag.com
Password: password123
```

## Pages

1. **Home** (`/`)
   - Landing page with features
   - Call-to-action to login

2. **Login** (`/login`)
   - Email/password authentication
   - JWT token storage
   - Redirect to dashboard on success

3. **Dashboard** (`/dashboard`)
   - Protected route (requires login)
   - Displays metrics (active deliveries, revenue, rating)
   - Quick action buttons
   - Recent deliveries list

## Features

✅ User authentication with JWT
✅ Protected routes
✅ Responsive design with Tailwind CSS
✅ API error handling
✅ Environment configuration
✅ CORS enabled
✅ Password hashing with bcrypt

## Next Steps (Step 2)

- Database schema implementation
- User profile management
- Delivery tracking system
- Real-time notifications
- Payment integration
- Admin dashboard
