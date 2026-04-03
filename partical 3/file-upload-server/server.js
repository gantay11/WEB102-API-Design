const express = require('express'); [cite: 29]
const cors = require('cors'); [cite: 29]
const morgan = require('morgan'); [cite: 29]
const path = require('path'); [cite: 29]
const fs = require('fs'); [cite: 29]
require('dotenv').config(); [cite: 30]

// Initialize express app
const app = express(); [cite: 32]
const PORT = process.env.PORT || 8000; [cite: 33]

// Middleware
app.use(cors()); [cite: 35]
app.use(express.json()); [cite: 36]
app.use(morgan('dev')); // HTTP request logging [cite: 37]

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads'); [cite: 38]
if (!fs.existsSync(uploadDir)) { [cite: 38]
    fs.mkdirSync(uploadDir, { recursive: true }); [cite: 40]
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir)); [cite: 42]

// Basic route for testing
app.get('/', (req, res) => { [cite: 44]
    res.send('File Upload Server is running'); [cite: 46]
});

// Start the server
app.listen(PORT, () => { [cite: 48]
    console.log(`Server running on port ${PORT}`); [cite: 49]
});