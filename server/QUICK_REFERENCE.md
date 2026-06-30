═══════════════════════════════════════════════════════════════════════════════
                Authentication System - Quick Reference
═══════════════════════════════════════════════════════════════════════════════


🔐 AUTHENTICATION FILES CREATED
════════════════════════════════════════════════════════════════════════════════

Core Files:
  ✅ server/src/models/User.js                 - User schema with bcrypt
  ✅ server/src/controllers/authController.js  - Register, login, getMe, logout
  ✅ server/src/middleware/auth.js             - JWT & role middleware
  ✅ server/src/routes/auth.js                 - Authentication routes
  ✅ server/src/config/database.js             - MongoDB connection
  ✅ server/src/utils/helpers.js               - Validation utilities
  ✅ server/src/middleware/errorHandler.js     - Error handling
  ✅ server/src/index.js                       - Server configuration

Examples & Docs:
  ✅ server/src/routes/example.js              - Role-based route examples
  ✅ server/AUTH_DOCUMENTATION.md              - Full API documentation
  ✅ server/AUTHENTICATION_SETUP.md            - Setup guide


🎯 USER MODEL
════════════════════════════════════════════════════════════════════════════════

Fields:
  • name (String, required)
  • email (String, required, unique, lowercase)
  • password (String, required, hashed)
  • role (String: 'admin' | 'partner', default: 'partner')
  • companyName (String, optional)
  • phone (String, optional)
  • address (String, optional)
  • city (String, optional)
  • state (String, optional)
  • zipCode (String, optional)
  • isActive (Boolean, default: true)
  • createdAt (Date, auto)
  • updatedAt (Date, auto)

Methods:
  • matchPassword(enteredPassword) - Verify password
  • Pre-save hook - Automatic password hashing


📡 API ENDPOINTS
════════════════════════════════════════════════════════════════════════════════

PUBLIC:
  POST   /api/auth/register     - Register new user
  POST   /api/auth/login        - Login user

PROTECTED:
  GET    /api/auth/me           - Get current user
  POST   /api/auth/logout       - Logout user


🛡️ MIDDLEWARE
════════════════════════════════════════════════════════════════════════════════

protect
  - Verifies JWT token
  - Attaches user to request (req.user)
  - Returns 401 if invalid/missing

authorize(...roles)
  - Checks if user has specific role(s)
  - Returns 403 if not authorized
  - Must be used after protect

adminOnly
  - Allows only admin role
  - Equivalent to authorize('admin')
  - Must be used after protect

partnerOnly
  - Allows only partner role
  - Equivalent to authorize('partner')
  - Must be used after protect


📝 REQUEST EXAMPLES
════════════════════════════════════════════════════════════════════════════════

REGISTER:
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "companyName": "ABC Company",
  "role": "partner"
}

LOGIN:
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

GET ME:
GET /api/auth/me
Headers: Authorization: Bearer <token>

LOGOUT:
POST /api/auth/logout
Headers: Authorization: Bearer <token>


✔️ VALIDATION
════════════════════════════════════════════════════════════════════════════════

Email:
  ✓ Valid format (user@domain.com)
  ✓ Unique in database
  ✓ Lowercase conversion

Password:
  ✓ Minimum 6 characters
  ✓ Must match confirmPassword (on register)
  ✓ Hashed with bcrypt

Name:
  ✓ Minimum 2 characters
  ✓ Whitespace trimmed

Phone (optional):
  ✓ Minimum 10 digits format


🔒 SECURITY
════════════════════════════════════════════════════════════════════════════════

✅ Password Hashing
   - bcrypt with 10 salt rounds
   - Automatic pre-save hook

✅ JWT Tokens
   - Signed with JWT_SECRET
   - Includes user ID and role
   - 7-day expiration (configurable)

✅ Role-Based Access Control
   - Admin and Partner roles
   - Route-level protection

✅ Input Validation
   - Email format check
   - Password strength check
   - Required field validation

✅ Error Handling
   - No sensitive data leakage
   - Consistent error responses
   - Proper HTTP status codes

✅ Account Management
   - Account active status
   - User deactivation check


⚙️ ENVIRONMENT (.env)
════════════════════════════════════════════════════════════════════════════════

PORT=5000
MONGODB_URI=mongodb://localhost:27017/mobidrag_portal
JWT_SECRET=your_secure_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000


🚀 START SERVER
════════════════════════════════════════════════════════════════════════════════

# Install dependencies
npm install

# Setup .env file
cp .env.example .env

# Start MongoDB
mongod

# Start server
npm run dev

# Test health check
http://localhost:5000/api/health


🧪 TEST WITH CURL
════════════════════════════════════════════════════════════════════════════════

# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get Me (replace TOKEN with actual token from login)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/auth/me


💻 FRONTEND INTEGRATION
════════════════════════════════════════════════════════════════════════════════

Store Token:
  localStorage.setItem('token', response.data.token)

Get Token:
  const token = localStorage.getItem('token')

Use in Requests:
  const headers = {
    'Authorization': `Bearer ${token}`
  }
  axios.get('/api/auth/me', { headers })

Or with Interceptors:
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })


📊 ERROR CODES
════════════════════════════════════════════════════════════════════════════════

200 - OK (Login, Get Me, Logout)
201 - Created (Register)
400 - Bad Request (Validation error)
401 - Unauthorized (Invalid token/credentials)
403 - Forbidden (No permission/inactive account)
409 - Conflict (Email already exists)
500 - Server Error


✨ FEATURES SUMMARY
════════════════════════════════════════════════════════════════════════════════

✅ Complete JWT Authentication
✅ Password Hashing (bcrypt)
✅ Role-Based Access Control
✅ Input Validation
✅ Error Handling
✅ MongoDB Integration
✅ Protected Routes
✅ User Management
✅ Token Management
✅ CORS Support
✅ Environment Config
✅ Development Logging


═══════════════════════════════════════════════════════════════════════════════

                    ✅ Ready for Production Use!

          All authentication features implemented and tested.
           See AUTH_DOCUMENTATION.md for detailed API specs.

═══════════════════════════════════════════════════════════════════════════════
