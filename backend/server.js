// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const complaintRoutes = require('./routes/complaintRoutes');
const contractorRoutes = require('./routes/contractorRoutes');
const authenticate = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(express.json()); // Built-in middleware to parse JSON
app.use('/api/complaints', complaintRoutes); // Register routes for complaints
app.use('/api/contractors', contractorRoutes); // Register routes for contractors

// Error handling middleware
app.use(errorHandler); // Use error handler middleware

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
