# Node Token Authentication

A token-based authentication system built with Node.js and Express using JSON Web Tokens (JWT).

##  Table of Contents

- [About](#about)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Security Notes](#security-notes)

## About

This project demonstrates how to implement a secure token-based authentication system in Node.js. It includes user registration, login, and protected routes using JWT. Passwords are hashed using bcrypt before being stored, and sensitive configuration values are managed using environment variables.

## Technologies Used

| Package | Purpose |
|---------|---------|
| Node.js | JavaScript runtime environment |
| Express | Web framework for building API routes |
| jsonwebtoken | Signing and verifying JWT tokens |
| bcryptjs | Hashing passwords securely |
| dotenv | Loading environment variables from .env file |
| Thunder Client | Testing API endpoints in VS Code |

## Project Structure

node-token-auth/
├── server.js               # Entry point — starts the Express server
├── .env                    # Environment variables (secret key, port)
├── routes/
│   ├── auth.js             # Register, Login, and Get Users routes
│   └── protected.js        # Protected profile route
└── middleware/
    └── verifyToken.js      # JWT verification middleware

## Getting Started

### Prerequisites
- Node.js installed on your machine
- VS Code with Thunder Client extension

### Installation

1. Clone or download the project folder

2. Navigate to the project directory:
cd node-token-auth

3. Initialize the project:
npm init -y

4. Install dependencies:
npm install express jsonwebtoken bcryptjs dotenv

5. Create a `.env` file in the root folder:
JWT_SECRET=supersecretkey123
PORT=3000

6. Start the server:
node server.js
The server will run at `http://localhost:3000`

## API Endpoints

### Auth Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login and receive a JWT token | No |
| GET | `/auth/users` | Get all registered users | No |

### Protected Routes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/profile` | Access protected user profile | Yes (Bearer Token) |

### Request & Response Examples

#### Register
**POST** `/auth/register`
json
// Request Body
{
  "name": "Sanskar",
  "email": "sanskar@test.com",
  "password": "123456"
}

// Response (201 Created)
{
  "message": "User registered successfully!"
}


#### Login
**POST** `/auth/login`
json
// Request Body
{
  "email": "sanskar@test.com",
  "password": "123456"
}

// Response (200 OK)
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}


#### Profile (Protected)
**GET** `/profile`
// Header
Authorization: Bearer <your_token_here>

// Response (200 OK)
{
  "message": "Welcome! You accessed a protected route.",
  "user": {
    "id": 1,
    "email": "sanskar@test.com",
    "iat": 1715000000,
    "exp": 1715086400
  }
}

#### Get All Users
**GET** `/auth/users`
json
// Response (200 OK)
[
  { "id": 1, "name": "Sanskar", "email": "sanskar@test.com" },
  { "id": 2, "name": "Dorji", "email": "dorji@test.com" }
]

## Testing

All endpoints were tested using **Thunder Client** in VS Code.

| Test | Method | Endpoint | Expected Status |
|------|--------|----------|-----------------|
| Register user | POST | /auth/register | 201 Created |
| Login user | POST | /auth/login | 200 OK |
| Access profile with token | GET | /profile | 200 OK |
| Access profile without token | GET | /profile | 401 Unauthorized |
| Access profile with fake token | GET | /profile | 403 Forbidden |
| Register with name | POST | /auth/register | 201 Created |
| Get all users | GET | /auth/users | 200 OK |

## Security Notes

- Passwords are never stored as plain text — they are hashed using **bcrypt** before saving.
- The JWT payload is only **base64 encoded**, not encrypted. Never store passwords or sensitive data inside a token.
- The `.env` file contains the JWT secret key and must **never be committed to GitHub**. Add it to `.gitignore`.
- Tokens expire after **1 day** for security purposes.
- The `/auth/users` endpoint never returns password fields, only safe user data.

## HTTP Status Code Reference

| Code | Meaning | When It Happens |
|------|---------|-----------------|
| 200 | OK | Login or profile access succeeded |
| 201 | Created | User registered successfully |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | No token provided or wrong credentials |
| 403 | Forbidden | Token is invalid or expired |
| 409 | Conflict | Email already registered |
