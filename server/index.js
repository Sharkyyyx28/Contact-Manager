const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load .env variables

const contactRoutes = require('./routes/contacts');

const app = express();

// Middleware
app.use(cors()); // Allow frontend to communicate
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/contacts', contactRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));