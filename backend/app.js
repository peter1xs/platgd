require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const routes = require('../backend/routes/index');
// At the top with other requires
const classRoutes = require('./routes/classRoutes');
const schoolRoutes = require('./routes/schoolRoutes');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());


// Database Connection
mongoose.connect("mongodb://localhost:27017/cobotKidsKenya")
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Routes
app.use('/cobotKidsKenya', routes);
app.use('/cobotKidsKenya', classRoutes);
app.use('/cobotKidsKenya/schools', schoolRoutes);



module.exports = app;