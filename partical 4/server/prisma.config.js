// server/prisma.config.js
require('dotenv').config(); // This line loads your .env variables
const { defineConfig } = require('@prisma/config');

module.exports = defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});