# Practical 5: Implementing Cloud Bucket Storage with Supabase

## Overview
This practical upgrades the TikTok web application by migrating from local file storage to cloud storage using Supabase Storage, enhancing scalability, reliability, and access control for user-uploaded content.

## What Was Implemented

### Backend
- Integrated Supabase Storage SDK into the Express.js server
- Created a reusable `storageService.js` for uploading and deleting files
- Updated `videoController.js` to upload videos and thumbnails directly to Supabase buckets
- Updated Prisma schema to include `videoStoragePath` and `thumbnailStoragePath` fields
- Synced database schema using `prisma db push`

### Supabase Setup
- Created two public storage buckets: `Video` and `thumbnails`
- Configured Row Level Security (RLS) policies:
  - Authenticated users can upload, update, delete, and select files
  - Anonymous users can publicly view/download files

## Technologies Used
- **Node.js** with Express.js
- **Supabase** (Storage, RLS Policies)
- **Prisma ORM** with PostgreSQL
- **Multer** for handling file uploads
- **@supabase/supabase-js** SDK

## Project Structure
server/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   │   └── videoController.js
│   ├── lib/
│   │   ├── prisma.js
│   │   └── supabase.js
│   ├── services/
│   │   └── storageService.js
│   └── index.js
├── .env
└── package.json

## Environment Variables
.env
DATABASE_URL=postgresql://user:password@localhost:5432/tiktok_db
PORT=8000
NODE_ENV=development
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_PUBLIC_KEY=your-anon-public-key
SUPABASE_STORAGE_URL=https://your-project-id.supabase.co/storage/v1

## Setup Instructions

### 1. Install dependencies
cd server
npm install

### 2. Configure environment variables
Copy the `.env.example` file and fill in your Supabase credentials.

### 3. Set up Supabase
- Create a Supabase project at [supabase.com](https://supabase.com)
- Create two public buckets: `Video` and `thumbnails`
- Set up RLS policies for authenticated uploads and public reads

### 4. Sync the database

npx prisma db push

### 5. Start the server

npm run dev

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/videos` | Get all videos |
| GET | `/api/videos/:id` | Get video by ID |
| POST | `/api/videos` | Create a new video |
| PUT | `/api/videos/:id` | Update a video |
| DELETE | `/api/videos/:id` | Delete a video |
| POST | `/api/videos/:id/like` | Like/unlike a video |
| GET | `/api/videos/:id/comments` | Get video comments |


## How Cloud Storage Works in This App
1. User selects a video and thumbnail through the frontend
2. Files are sent to the Express server via multipart form data
3. The server uploads files to Supabase Storage buckets
4. Supabase returns a public CDN URL for each file
5. The URL and storage path are saved in the PostgreSQL database
6. When a video is deleted, the files are removed from Supabase Storage

## References
- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Prisma ORM Documentation](https://www.prisma.io/docs)