# Reflection — Token-Based Authentication in Node.js using JWT
## Overview

This lab was a valuable and practical experience in understanding how authentication works in modern web applications. Before this lab, authentication seemed complex and difficult to implement, but building it step by step made the concepts much clearer and easier to understand.

## What I Learned

### Token-Based Authentication
One of the most important things learned was the difference between session-based and token-based authentication. Understanding why token-based authentication is preferred in modern applications, especially because it is stateless and does not require the server to store session data, was a key insight. It became clear how this approach makes applications more scalable and easier to maintain.

### JSON Web Tokens (JWT)
Working with JWT was particularly interesting. Seeing how the token is made up of three parts — the header, payload, and signature — and understanding that the payload is only base64 encoded and not encrypted was an important lesson. This made it clear why sensitive information like passwords should never be placed inside a token, as anyone can decode and read the payload.

### Password Hashing with bcrypt
Implementing password hashing with bcrypt was another significant learning point. Before this lab, the importance of never storing plain text passwords was understood theoretically, but actually seeing the hashed output in the code made it much more real. It is reassuring to know that even if a database is compromised, the original passwords cannot be recovered from the hashes.

### Middleware in Express
The middleware concept in Express was also a highlight of this lab. Understanding how a function can sit between a request and a response to check for a valid token before allowing access to a protected route was a practical demonstration of how security layers work in real applications.

## Challenges Faced

There were some challenges during the lab, particularly in setting up the project since several files were empty and the packages were not installed. This was a good reminder of the importance of following setup steps carefully and verifying that all files have the correct content before running the server. Troubleshooting these issues also helped build confidence in reading error messages and finding solutions independently.

## Testing Experience

Testing the API endpoints using Thunder Client was a helpful experience. Being able to send requests and see the responses in real time made it easy to verify that each part of the system was working correctly. Seeing the 401, 403, and 200 status codes appear as expected gave a clear understanding of how HTTP status codes communicate the result of each request.

### Test Results Summary

| Test | Endpoint | Status | Result |
|------|----------|--------|--------|
| Register user | POST /auth/register | 201 Created | ✅ Passed |
| Login user | POST /auth/login | 200 OK | ✅ Passed |
| Access profile with token | GET /profile | 200 OK | ✅ Passed |
| Access profile without token | GET /profile | 401 Unauthorized | ✅ Passed |
| Access profile with fake token | GET /profile | 403 Forbidden | ✅ Passed |
| Register with name | POST /auth/register | 201 Created | ✅ Passed |
| Get all users | GET /auth/users | 200 OK | ✅ Passed |

## Key Takeaways

- Token-based authentication is stateless and more scalable than session-based authentication.
- JWT payload is readable by anyone and should never contain sensitive data like passwords.
- Passwords must always be hashed before storing using a one-way function like bcrypt.
- Middleware is a powerful way to add security layers to API routes in Express.
- Environment variables must be used to store secret keys and should never be committed to GitHub.
- Reading error messages carefully is essential for debugging and fixing issues quickly.

## Conclusion

Overall this lab provided a strong foundation in backend authentication that will be useful in future web development projects. The skills and concepts learned here, including JWT, password hashing, middleware, and environment variables, are widely used in the industry and will be applied in building more secure and reliable applications in the future.