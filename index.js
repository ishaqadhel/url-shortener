const express = require('express');
const { connect } = require('mongoose');
const connectDB = require('./config/db');
const app = express();

/** Connect to database **/
connectDB();

app.use(express.json({ extended: false}));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));