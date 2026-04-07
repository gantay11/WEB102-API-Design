TikTok REST API
A RESTful API backend for a TikTok-like application built with Node.js and Express. This API supports videos, users, and comments with full CRUD operations, likes, and follower relationships.

Tech Stack

Node.js – Runtime environment
Express – Web server framework
cors – Cross-Origin Resource Sharing
morgan – HTTP request logging
body-parser – Request body parsing
dotenv – Environment variable management
nodemon – Development auto-reload


Project Structure
server/
├── src/
│   ├── app.js                    # Express app setup & middleware
│   ├── index.js                  # Server entry point
│   ├── controllers/
│   │   ├── videoController.js    # Video route handlers
│   │   ├── userController.js     # User route handlers
│   │   └── commentController.js  # Comment route handlers
│   ├── routes/
│   │   ├── videos.js             # Video routes
│   │   ├── users.js              # User routes
│   │   └── comments.js           # Comment routes
│   ├── models/
│   │   └── index.js              # In-memory data store
│   ├── middleware/               # Custom middleware
│   └── utils/                    # Utility helpers
├── .env
└── package.json

Getting Started
1. Clone and install
bashmkdir -p server && cd server
npm init -y
npm install express cors morgan body-parser dotenv
npm install --save-dev nodemon
2. Configure environment
Create a .env file in the root:
PORT=3000
NODE_ENV=development
3. Run the server
bash# Development (with auto-reload)
npm run dev

# Production
npm start
The server will start at http://localhost:3000.

API Reference
Videos
MethodEndpointDescriptionGET/api/videosGet all videosPOST/api/videosCreate a new videoGET/api/videos/:idGet video by IDPUT/api/videos/:idUpdate a videoDELETE/api/videos/:idDelete a videoGET/api/videos/:id/commentsGet comments for a videoGET/api/videos/:id/likesGet users who liked a videoPOST/api/videos/:id/likesLike a videoDELETE/api/videos/:id/likesUnlike a video
Users
MethodEndpointDescriptionGET/api/usersGet all usersPOST/api/usersCreate a new userGET/api/users/:idGet user by IDPUT/api/users/:idUpdate a userDELETE/api/users/:idDelete a userGET/api/users/:id/videosGet videos by a userGET/api/users/:id/followersGet user's followersPOST/api/users/:id/followersFollow a userDELETE/api/users/:id/followersUnfollow a user
Comments
MethodEndpointDescriptionGET/api/commentsGet all commentsPOST/api/commentsCreate a new commentGET/api/comments/:idGet comment by IDPUT/api/comments/:idUpdate a commentDELETE/api/comments/:idDelete a commentPOST/api/comments/:id/likesLike a commentDELETE/api/comments/:id/likesUnlike a comment
## Note
Data is stored in-memory and will reset on server restart. A database (e.g. PostgreSQL, MongoDB) should be integrated for persistence.
The API only accepts and returns application/json. Requests with other content types will receive a 406 Not Acceptable response.
Error messages follow a consistent { "error": "..." } format.