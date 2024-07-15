var express = require('express')
const app = express()
var path = require("path");
var logger = require("morgan");
const cors = require("cors");
const frontRoutes = require("./src/frontend/routes");
const handleError = require("./src/utils/handleError");
const  {connect}  = require("./src/config/db.config");
const fileUpload = require("express-fileupload");
const passport = require("passport");

// Connect to the database
connect();

require("./src/cron/index");

// Initialize logger
app.use(logger('dev'));

// Middleware for parsing JSON requests
app.use(express.json({ limit: '10mb' }));

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware for file uploading
app.use(fileUpload());

// Middleware for parsing JSON requests
app.use(express.json());

// Middleware for parsing URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Cors middleware configuration
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Initialize passport
app.use(passport.initialize());

// Require passport strategies
require("./src/stratagies/passport-local");
require("./src/therapistStratagies/passport-local1");

app.use(cors(corsOptions));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// API routes for frontend
app.use("/api/front", frontRoutes);


// Serve admin build
app.use("/", express.static(path.join(__dirname, "./build")));

// Serve admin and frontend index files
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "./build", "index.html"));
});

// Error handling middleware
app.use(handleError);

module.exports = app;
