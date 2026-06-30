// Authentication System Documentation
// ====================================

/**
 * USER MODEL STRUCTURE
 * =====================
 * {
 *   name: String (required)
 *   email: String (required, unique, lowercase)
 *   password: String (required, hashed with bcrypt)
 *   companyName: String (optional)
 *   phone: String (optional)
 *   address: String (optional)
 *   city: String (optional)
 *   state: String (optional)
 *   zipCode: String (optional)
 *   role: 'partner' | 'admin' (default: 'partner')
 *   isActive: Boolean (default: true)
 *   createdAt: Date
 *   updatedAt: Date
 * }
 */

/**
 * API ENDPOINTS
 * =============
 */

// 1. REGISTER USER
// ----------------
// POST /api/auth/register
// 
// Request Body:
// {
//   "name": "John Doe",
//   "email": "john@example.com",
//   "password": "password123",
//   "confirmPassword": "password123",
//   "companyName": "ABC Company",
//   "role": "partner" // optional, defaults to 'partner'
// }
//
// Response:
// {
//   "success": true,
//   "message": "User registered successfully",
//   "token": "eyJhbGciOiJIUzI1NiIs...",
//   "user": {
//     "id": "507f1f77bcf86cd799439011",
//     "name": "John Doe",
//     "email": "john@example.com",
//     "role": "partner",
//     "companyName": "ABC Company"
//   }
// }
//
// Status Codes:
// 201 - Success
// 400 - Validation error
// 409 - Email already registered
// 500 - Server error

// 2. LOGIN USER
// -------------
// POST /api/auth/login
//
// Request Body:
// {
//   "email": "john@example.com",
//   "password": "password123"
// }
//
// Response:
// {
//   "success": true,
//   "message": "Logged in successfully",
//   "token": "eyJhbGciOiJIUzI1NiIs...",
//   "user": {
//     "id": "507f1f77bcf86cd799439011",
//     "name": "John Doe",
//     "email": "john@example.com",
//     "role": "partner",
//     "companyName": "ABC Company"
//   }
// }
//
// Status Codes:
// 200 - Success
// 400 - Validation error
// 401 - Invalid credentials
// 403 - Account deactivated
// 500 - Server error

// 3. GET CURRENT USER
// -------------------
// GET /api/auth/me
// Headers: Authorization: Bearer <token>
//
// Response:
// {
//   "success": true,
//   "user": {
//     "_id": "507f1f77bcf86cd799439011",
//     "name": "John Doe",
//     "email": "john@example.com",
//     "companyName": "ABC Company",
//     "phone": "1234567890",
//     "role": "partner",
//     "isActive": true,
//     "createdAt": "2024-01-15T10:30:00.000Z"
//   }
// }
//
// Status Codes:
// 200 - Success
// 401 - Not authenticated
// 404 - User not found
// 500 - Server error

// 4. LOGOUT
// ---------
// POST /api/auth/logout
// Headers: Authorization: Bearer <token>
//
// Response:
// {
//   "success": true,
//   "message": "Logged out successfully"
// }
//
// Status Codes:
// 200 - Success
// 401 - Not authenticated
// 500 - Server error

/**
 * MIDDLEWARE USAGE
 * ================
 */

// 1. PROTECT MIDDLEWARE
// Verifies JWT token
// Usage: router.get('/protected', protect, controller)

// 2. AUTHORIZE MIDDLEWARE
// Checks if user has specific roles
// Usage: router.get('/route', protect, authorize('admin', 'partner'), controller)

// 3. ADMIN ONLY MIDDLEWARE
// Only allows admin users
// Usage: router.get('/admin', protect, adminOnly, controller)

// 4. PARTNER ONLY MIDDLEWARE
// Only allows partner users
// Usage: router.get('/partner', protect, partnerOnly, controller)

/**
 * ENVIRONMENT VARIABLES REQUIRED
 * ==============================
 */

// PORT=5000
// MONGODB_URI=mongodb://localhost:27017/mobidrag_portal
// JWT_SECRET=your_secure_secret_key_here
// JWT_EXPIRE=7d
// NODE_ENV=development
// FRONTEND_URL=http://localhost:3000

/**
 * ERROR RESPONSES
 * ===============
 */

// Validation Error (400)
// {
//   "success": false,
//   "message": "Please provide a valid email address"
// }

// Unauthorized (401)
// {
//   "success": false,
//   "message": "Not authorized to access this route. Please provide a token."
// }

// Forbidden (403)
// {
//   "success": false,
//   "message": "This route is only accessible to administrators"
// }

// Conflict (409)
// {
//   "success": false,
//   "message": "Email is already registered"
// }

// Server Error (500)
// {
//   "success": false,
//   "message": "An error occurred during login"
// }

/**
 * TOKEN STRUCTURE
 * ===============
 */

// JWT contains:
// {
//   "id": "507f1f77bcf86cd799439011",
//   "role": "partner",
//   "iat": 1610671200,
//   "exp": 1611276000
// }
//
// Token expires in 7 days (configurable via JWT_EXPIRE)
// Token is sent in response on login/register
// Token is sent in Authorization header for protected routes

/**
 * VALIDATION RULES
 * ================
 */

// Name:
// - Required
// - Minimum 2 characters
// - Trimmed of whitespace

// Email:
// - Required
// - Valid email format
// - Unique in database
// - Converted to lowercase

// Password:
// - Required
// - Minimum 6 characters
// - Hashed with bcrypt (10 salt rounds)
// - Must match confirmPassword on registration

// Role:
// - Optional (defaults to 'partner')
// - Enum: 'partner' | 'admin'

// Company Name:
// - Optional
// - Trimmed of whitespace

/**
 * SECURITY FEATURES
 * =================
 */

// 1. Password Hashing
//    - bcrypt with 10 salt rounds
//    - Automatic on user creation/update
//    - Verified on login

// 2. JWT Tokens
//    - Signed with JWT_SECRET
//    - Includes user ID and role
//    - Expiration: 7 days (configurable)
//    - Bearer token in Authorization header

// 3. Input Validation
//    - Email format validation
//    - Password strength validation
//    - Field length validation
//    - Trim whitespace

// 4. Error Handling
//    - No sensitive data leaked
//    - Consistent error responses
//    - Error logging (development only)

// 5. Role-Based Access Control
//    - Admin-only routes
//    - Partner-only routes
//    - Multi-role routes

/**
 * TESTING WITH CURL
 * =================
 */

// Register:
// curl -X POST http://localhost:5000/api/auth/register \
//   -H "Content-Type: application/json" \
//   -d '{"name":"John","email":"john@test.com","password":"pass123","confirmPassword":"pass123"}'

// Login:
// curl -X POST http://localhost:5000/api/auth/login \
//   -H "Content-Type: application/json" \
//   -d '{"email":"john@test.com","password":"pass123"}'

// Get User (replace TOKEN with actual token):
// curl -H "Authorization: Bearer TOKEN" \
//   http://localhost:5000/api/auth/me
