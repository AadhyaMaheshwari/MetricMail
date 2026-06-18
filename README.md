# Full-Stack Monorepo Application

A full-stack web application with a React frontend (Vite) and Node.js/Express backend using MongoDB for data storage and JWT for authentication.

## Project Structure

```
fullstack-monorepo/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/         # Page components (SignUp, SignIn, Dashboard)
│   │   ├── App.jsx        # Main app component with React Router
│   │   ├── main.jsx       # Entry point
│   │   ├── App.css        # Styling
│   │   └── index.css      # Global styles
│   ├── index.html         # HTML entry point
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Client dependencies
├── server/                # Express backend
│   ├── models/
│   │   └── User.js        # Mongoose User schema
│   ├── routes/
│   │   └── auth.js        # Authentication routes
│   ├── index.js           # Express server setup
│   ├── .env               # Environment variables
│   └── package.json       # Server dependencies
├── package.json           # Root monorepo config
└── .gitignore            # Git ignore file
```

## Features

### Frontend (Client)
- **React 18** with Vite for fast development
- **React Router** with three main routes:
  - `/signup` - Sign up page
  - `/signin` - Sign in page
  - `/dashboard` - Dashboard page (protected)
- JWT token-based authentication
- Responsive styling with CSS

### Backend (Server)
- **Express.js** server running on port 5000
- **MongoDB** for persistent data storage
- **Mongoose** ODM for database operations
- **JWT** tokens for secure authentication
- **bcryptjs** for password hashing
- **CORS** middleware for cross-origin requests
- RESTful API endpoints:
  - `POST /api/auth/signup` - Register new user
  - `POST /api/auth/signin` - Login user and return JWT token
  - `GET /api/health` - Server health check
  - `GET /api/dashboard` - Dashboard data

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance like MongoDB Atlas)

## Environment Setup

### MongoDB Connection

If you don't have MongoDB installed, you can:
1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/
2. Or use MongoDB Atlas (free cloud service): https://www.mongodb.com/cloud/atlas

### Server Environment Variables

Create or edit `server/.env` with:
```
MONGO_URI=mongodb://localhost:27017/signup-app
JWT_SECRET=your_secret_key_here_change_this
PORT=5000
```

Replace `MONGO_URI` with your MongoDB connection string and `JWT_SECRET` with a secure secret key.

## Installation

All dependencies have been installed. To reinstall:

```bash
# Install root dependencies
npm install

# Install server dependencies
npm --prefix server install

# Install client dependencies
npm --prefix client install
```

## Running the Application

### Development Mode (Both Client and Server)
Run both frontend and backend concurrently:

```bash
npm run dev
```

This will:
- Start the Express server on `http://localhost:5000`
- Start the Vite dev server on `http://localhost:3000`

### Run Client Only
```bash
npm run client
```
Starts Vite dev server on `http://localhost:3000`

### Run Server Only
```bash
npm run server
```
Starts Express server on `http://localhost:5000`

### Production Build
```bash
npm run build
```
Creates optimized production build of the client

## Authentication Flow

1. **Signup**: User registers with name, email, and password
   - Password is hashed with bcryptjs (10 salt rounds)
   - User data is saved to MongoDB
   
2. **Signin**: User logs in with email and password
   - Password is compared with stored hash
   - JWT token is generated (expires in 7 days)
   - Token and user name are returned to client
   
3. **Dashboard**: Protected route that checks for valid JWT token
   - Token is stored in localStorage
   - Dashboard verifies token on mount
   - Sign out removes both token and user data

## API Endpoints

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/signup` | `{ name, email, password }` | `{ token, user: { id, name, email } }` |
| POST | `/api/auth/signin` | `{ email, password }` | `{ token, user: { id, name, email } }` |
| GET | `/api/health` | - | `{ message: "Server is running" }` |

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ 7-day token expiration
- ✅ MongoDB unique index on email field
- ✅ Input validation on server

## Browser Access

Once both servers are running:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

## Data Storage

All user data is stored in MongoDB with the following schema:
```json
{
  "_id": ObjectId,
  "name": string,
  "email": string (unique),
  "password": string (hashed),
  "createdAt": timestamp,
  "updatedAt": timestamp
}
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or check your MONGO_URI in `.env`
- For MongoDB Atlas, verify your IP is whitelisted

### Port Already in Use
If port 3000 or 5000 is already in use:
- Server: Edit `PORT` in `server/.env`
- Client: Edit `server.port` in `client/vite.config.js`

### JWT_SECRET Error
- Set a strong `JWT_SECRET` in `server/.env`
- Example: `JWT_SECRET=your_very_secure_random_string_123`

## Next Steps

1. Deploy to production (Vercel for frontend, Railway/Heroku for backend)
2. Add password reset functionality
3. Implement email verification
4. Add user profile management
5. Add refresh tokens for better security

## License

MIT

