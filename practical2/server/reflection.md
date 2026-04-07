## What I Built
In this practical, I designed and implemented a RESTful API backend for a TikTok-style application using Node.js and Express. The API supports three core resources — Videos, Users, and Comments — each with full CRUD operations and social interaction features like likes and follows.

## What I Learned
1. REST API Design Principles
This practical gave me hands-on experience applying REST conventions properly. I learned that:

Endpoints should represent resources (nouns, not verbs) — e.g., /api/videos not /api/getVideos
HTTP methods carry the action meaning — GET retrieves, POST creates, PUT updates, DELETE removes
Nested routes like /api/videos/:id/comments express relationships between resources cleanly
HTTP status codes carry semantic meaning and should be used precisely (201 for created, 204 for no content, 409 for conflicts, etc.)

2. MVC-Style Project Structure
Separating the code into routes, controllers, and models made a real difference in readability and maintainability. Even with an in-memory data store, having this separation means swapping in a real database later would only require changes in one layer (models/controllers), not across the whole codebase.
3. Express Middleware
I learned how middleware works as a chain — each app.use() call runs in order. Setting up cors, morgan, body-parser, and a custom JSON-enforcement middleware gave me practical insight into how real Express applications are structured. The error-handling middleware (four-argument function) was a particularly interesting pattern.
4. In-Memory Data Management
Working without a database forced me to think carefully about data integrity:

When deleting a user, I had to cascade-delete their videos and comments, and clean up follower/following arrays
When liking a video, I had to check for duplicates (returning 409 Conflict)
Maintaining nextIds counters simulates what an auto-incrementing database primary key would do

5. Validation and Error Handling
I implemented validation at the controller level — checking for required fields, verifying related resources exist before linking them, and preventing impossible states (e.g., self-following). Returning meaningful error messages with appropriate status codes is something I'll carry forward into every API I build.

## Challenges I Faced
Cascading Deletes: The trickiest part was ensuring consistency when deleting users or videos. It's easy to remove the primary record but forget to clean up references elsewhere. I solved this by filtering related arrays in the data store after each delete.
Understanding Route Order: Early on I had to think carefully about route ordering in Express — more specific routes (like /:id/comments) must be defined before catch-all patterns, or they can be mistakenly matched by the wrong handler.
Bidirectional Relationships: The follow/unfollow feature requires updating two records simultaneously (the target user's followers array AND the follower's following array). Missing either side would create data inconsistency.
![alt text](<Screenshot 2026-04-07 171001.png>) This error was main problem for me to solve it. sometime its working.

## What I Would Improve

Add a real database – MongoDB with Mongoose or PostgreSQL with Prisma would make data persistent and support more complex queries
Authentication & Authorization – Add JWT-based auth so only the video owner can delete their own videos
Pagination – /api/videos could return thousands of results; adding ?page=1&limit=10 query params would be essential in production
Input sanitization – Use a validation library like express-validator or Joi for cleaner, more robust request validation
Unit tests – Write tests with Jest and Supertest to verify each endpoint behaves correctly under edge cases


## How This Connects to the Frontend
This API is designed to integrate with a Next.js frontend. The frontend would call these endpoints using fetch or axios, and the CORS middleware I configured ensures cross-origin requests from the Next.js dev server are allowed. This practical gave me a much clearer mental model of the request-response cycle between a frontend and backend, and why well-designed APIs make frontend development significantly easier.