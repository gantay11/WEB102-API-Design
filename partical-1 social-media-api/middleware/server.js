const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Routes
const users = require('./routes/users');
const posts = require('./routes/posts');

app.use('/api/users', users);
app.use('/api/posts', posts);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});