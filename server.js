// dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const socketIo = require("socket.io");
const passport = require("passport");
const moment = require("moment");
const http = require("http"); // Create the HTTP server

// sessions
const expressSession = require("express-session")({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
});

require("dotenv").config();

// instantiations
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000; // Use environment port or default to 4000
const io = socketIo(server);

// import models
const User = require("./models/user");

// importing routes
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const patientRoutes = require("./routes/patientRoutes");

// configurations
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection
  .once("open", () => {
    console.log("Database connected successfully");
  })
  .on("error", (err) => {
    console.error(`Connection error: ${err.message}`);
  });

// socket.IO setup
app.set("io", io); // Make Socket.IO accessible in routes

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// set view engine to pug
app.locals.moment = moment;
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serve static files from 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// express session configs
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

// passport configs
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use imported routes
app.use("/", notificationRoutes);
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/", patientRoutes);

// handle 404 errors
app.get("*", (req, res) => {
  res.status(404).render("not-found");
});

// start the server
server.listen(port, () => console.log(`Server listening on port ${port}`));
