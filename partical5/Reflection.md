# Reflection: Practical 5 - Implementing Cloud Bucket Storage with Supabase

## What I Learned

### Cloud Storage Concepts
Before this practical, I had only worked with local file storage, saving uploaded files directly to the server's disk. This practical taught me the fundamental limitations of that approach — disk space constraints, lack of scalability across multiple servers, and the risk of losing files if the server crashes or is redeployed.

Through implementing Supabase Storage, I learned how cloud storage solves these problems by providing virtually unlimited capacity, built-in redundancy, and global CDN distribution for faster access worldwide.

### Supabase Storage
I gained hands-on experience setting up Supabase Storage buckets and configuring Row Level Security (RLS) policies. I learned the difference between:
- **Public buckets** — anyone can read files without authorization
- **Authenticated access** — only logged-in users can upload, update, or delete files
- **Anonymous access** — public users can view/download files

Setting up separate policies for INSERT, UPDATE, DELETE, and SELECT operations gave me a deeper understanding of fine-grained access control in cloud storage systems.

### Backend Integration
Integrating Supabase into the Express.js backend was a valuable experience. I learned how to:
- Create a reusable Supabase client using environment variables
- Build a `storageService.js` module to abstract file upload and delete operations
- Generate unique file names to avoid collisions using timestamps and random strings
- Upload files as buffers to Supabase and retrieve public CDN URLs
- Clean up local temporary files after uploading to the cloud
- Store storage paths in the database alongside public URLs for future deletion

### Prisma Schema Updates
I learned how to safely add new fields to an existing Prisma schema without losing data. The `prisma db push` command was particularly useful when the standard migration approach had conflicts with shadow database issues.

---

## Challenges Faced

### 1. Finding the Correct Project Folder
At the beginning, I accidentally ran commands in the wrong directory (`partical5` instead of `partical 4`). This taught me the importance of always verifying my current working directory before running commands.

### 2. Migration Error with Shadow Database
Running `npx prisma migrate dev` failed due to a missing `video_hashtags` table in the shadow database. This was caused by a mismatch between the migration history and the actual database state. I resolved this by using `npx prisma db push` instead, which directly synced the schema without requiring a clean migration history.

### 3. Duplicate Code in storageService.js
When adding code to the storage service file, I accidentally pasted new code at the bottom of existing code, resulting in duplicate `require` statements and conflicting `module.exports`. I learned to always use `Ctrl+A` to select all and replace the entire file content when making complete rewrites.

### 4. Environment Variable Configuration
Understanding which Supabase key to use where was initially confusing. I learned that:
- The `service_role` key is for the backend server (has full access, must be kept secret)
- The `anon` public key is for the frontend (safe to expose, limited by RLS policies)

---

## What I Would Do Differently

1. **Organize folders better** — I would name project folders consistently (e.g., `practical5` instead of `partical5`) to avoid navigation errors.
2. **Test storage uploads independently** — Before integrating with the full controller, I would test the storage service with a simple standalone script to verify Supabase connectivity.
3. **Use environment variable validation** — I would add stricter validation at startup to ensure all required environment variables are present before the server starts.
4. **Add file type and size restrictions** — In a production app, I would restrict uploads to specific MIME types (e.g., only `video/mp4`) and enforce file size limits to prevent abuse.

---

## Conclusion

This practical significantly improved my understanding of cloud storage integration in web applications. Moving from local file storage to Supabase Storage made the application more scalable, reliable, and production-ready. The experience of configuring RLS policies also deepened my understanding of security best practices in modern web development. I now feel confident integrating cloud storage solutions into future projects.