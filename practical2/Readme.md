TikTok REST API
A RESTful API backend for a TikTok clone, built with Node.js and Express. Supports full CRUD operations for Videos, Users, and Comments with social features like likes and follows.

🚀 Getting Started
Prerequisites

Node.js v18+
npm

Installation
bash# Clone or navigate to the server directory
cd server

# Install dependencies
npm install

# Start in development mode (with hot reload)
npm run dev

# Start in production mode
npm start
The server will run at: http://localhost:3000

📁 Project Structure
server/
├── src/
│   ├── controllers/
│   │   ├── videoController.js      # Video CRUD + likes logic
│   │   ├── userController.js       # User CRUD + follow logic
│   │   └── commentController.js    # Comment CRUD + likes logic
│   ├── routes/
│   │   ├── videos.js               # /api/videos routes
│   │   ├── users.js                # /api/users routes
│   │   └── comments.js             # /api/comments routes
│   ├── models/
│   │   └── index.js                # In-memory data store
│   ├── middleware/                 # (reserved for future middleware)
│   ├── utils/                      # (reserved for helper utilities)
│   ├── app.js                      # Express app setup
│   └── index.js                    # Server entry point
├── .env                            # Environment variables
└── package.json

📡 API Endpoints
Videos
MethodEndpointDescriptionGET/api/videosGet all videosPOST/api/videosCreate a new videoGET/api/videos/:idGet video by IDPUT/api/videos/:idUpdate a videoDELETE/api/videos/:idDelete a videoGET/api/videos/:id/commentsGet video commentsGET/api/videos/:id/likesGet users who liked a videoPOST/api/videos/:id/likesLike a videoDELETE/api/videos/:id/likesUnlike a video
Users
MethodEndpointDescriptionGET/api/usersGet all usersPOST/api/usersCreate a new userGET/api/users/:idGet user by IDPUT/api/users/:idUpdate a userDELETE/api/users/:idDelete a userGET/api/users/:id/videosGet user's videosGET/api/users/:id/followersGet user's followersPOST/api/users/:id/followersFollow a userDELETE/api/users/:id/followersUnfollow a user
Comments
MethodEndpointDescriptionGET/api/commentsGet all commentsPOST/api/commentsCreate a new commentGET/api/comments/:idGet comment by IDPUT/api/comments/:idUpdate a commentDELETE/api/comments/:idDelete a commentGET/api/comments/:id/likesGet users who liked a commentPOST/api/comments/:id/likesLike a commentDELETE/api/comments/:id/likesUnlike a comment

🧪 Testing with curl
bash# Get all users
curl -X GET http://localhost:3000/api/users

# Get all videos
curl -X GET http://localhost:3000/api/videos

# Get user by ID
curl -X GET http://localhost:3000/api/users/1

# Get video by ID
curl -X GET http://localhost:3000/api/videos/1

# Get user's videos
curl -X GET http://localhost:3000/api/users/1/videos

# Get video comments
curl -X GET http://localhost:3000/api/videos/1/comments

# Create a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "new_user", "email": "new@example.com", "name": "New User"}'

# Create a new video
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -d '{"title": "My Video", "url": "https://example.com/vid", "userId": 1}'

# Like a video
curl -X POST http://localhost:3000/api/videos/1/likes \
  -H "Content-Type: application/json" \
  -d '{"userId": 1}'

# Follow a user
curl -X POST http://localhost:3000/api/users/2/followers \
  -H "Content-Type: application/json" \
  -d '{"followerId": 1}'

🔁 HTTP Status Codes Used
CodeMeaning200OK – Successful GET / PUT201Created – Successful POST204No Content – Successful DELETE400Bad Request – Missing/invalid fields404Not Found – Resource doesn't exist406Not Acceptable – Client doesn't accept JSON409Conflict – Duplicate resource (e.g. already liked)500Internal Server Error

⚙️ Environment Variables
VariableDefaultDescriptionPORT3000Port the server listens onNODE_ENVdevelopmentRuntime environment

📦 Dependencies
PackagePurposeexpressWeb server frameworkcorsCross-Origin Resource SharingmorganHTTP request loggingbody-parserParse JSON/URL-encoded request bodiesdotenvLoad .env environment variablesnodemon (dev)Auto-restart on file changes

📝 Notes

Data is stored in-memory — all data resets when the server restarts.
No authentication is implemented in this version.
This API is designed to connect with a Next.js frontend.