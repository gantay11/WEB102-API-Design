# Practical 4: Connecting TikTok to PostgreSQL with Prisma ORM

## Objectives

- Set up a PostgreSQL database for the TikTok clone application
- Configure Prisma ORM to interact with the database
- Migrate from in-memory data models to persistent database storage
- Implement authentication with password encryption
- Update RESTful API endpoints to use the database

## Prerequisites

Make sure the following are installed on your system:
- Node.js (v18+)
- PostgreSQL
- npm
- Postman (for testing)

## Part 1: Setting Up the PostgreSQL Database

## Step 1: Access the PostgreSQL command line

sudo -u postgres psql

### Step 2: Create the database and user

CREATE DATABASE tiktok_db;

CREATE USER tiktok_user WITH ENCRYPTED PASSWORD '02250368';
GRANT ALL PRIVILEGES ON DATABASE tiktok_db TO tiktok_user;

### Step 3: Exit PostgreSQL

\q

## Part 2: Setting Up Prisma ORM

### Step 1: Install Prisma dependencies

cd server
npm install @prisma/client
npm install prisma --save-dev

### Step 2: Initialise Prisma

npx prisma init

This creates:
-prisma/schema.prisma — schema definition file
-.env — environment variables file

### Step 3: Configure the database connection

Edit your .env file:

DATABASE_URL="postgresql://tiktok_user:your_password@localhost:5432/tiktok_db?schema=public"

### Step 4: Install additional dependencies

npm install bcrypt jsonwebtoken

## Part 3: Define the Prisma Schema

Replace the contents of `prisma/schema.prisma` with the TikTok data model, defining models for:

- User
- Video
- Comment
- Like
- Follow

## Part 4: Run Migrations

### Step 1: Create and apply the migration

npx prisma migrate dev --name init

This will:
1. Create SQL migration files in `prisma/migrations/`
2. Apply the migration to your database
3. Regenerate the Prisma Client

### Step 2: Create the Prisma client instance

Create src/lib/prisma.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;

## Part 5: Authentication Middleware

Create - src/middleware/auth.js

## Part 6: Update Controllers

Update the following controllers to use Prisma instead of in-memory data:

File  Key Changes

 `userController.js` Password hashing with bcrypt, JWT generation on login |
 `videoController.js` Relations, transactions, aggregations with Prisma |
 `commentController.js`  Persist and fetch comments from the database |

## Part 7: Configure Environment Variables

# Server settings
PORT=5000
NODE_ENV=development

# Database settings
DATABASE_URL="postgresql://tiktok_user:02250368@localhost:5432/tiktok_db?schema=public"

## Part 8: Seed the Database
### Step 1: Create the seed file

Create prisma/seed.js with logic to insert test data.

### Step 2: Add seed script to package.json
"scripts": {
  "dev": "nodemon src/index.js",
  "start": "node src/index.js",
  "seed": "node prisma/seed.js"
}

### Step 3: Run the seed

npm install bcrypt
npm run seed

This populates the database with:
- 10 users
- 50 videos (5 per user)
- 200 comments
- 300 video likes
- 150 comment likes
- 40 follow relationships

## Testing with Postman
### 1. Register a new user

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/users/register`
- **Body (JSON):**

json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "name": "Test User"
}

### 2. Login

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/users/login`
- **Body (JSON):**

json
{
  "email": "test@example.com",
  "password": "password123"
}

### 3. Access a protected route

- **Method:** `POST`
- **URL:** `http://localhost:5000/api/videos`
- **Header:** `Authorization: Bearer <your_token>`

## Key Concepts

### Object-Relational Mapping (ORM)
Prisma maps database tables to JavaScript objects, allowing database operations to be written as method calls rather than raw SQL.

### Password Security
Passwords are hashed using `bcrypt` before storage. Plain-text passwords are never saved to the database.

### JWT Authentication
Login returns a signed JWT token. The token must be sent in the `Authorization` header for protected routes.

### Database Migrations
Prisma migrations version-control the database schema. Each `migrate dev` run creates an auditable SQL file.

## References

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [jsonwebtoken npm](https://www.npmjs.com/package/jsonwebtoken)
- [bcrypt npm](https://www.npmjs.com/package/bcrypt)
- [TikTok Server Repository](https://github.com/syangche/TikTok_Server.git)