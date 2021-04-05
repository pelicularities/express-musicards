require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const requireJsonContent = require("./middleware/requireJsonContent");
const app = express();
app.use(express.json());
app.use(cookieParser());

// MIDDLEWARE
const whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://604b239e45c7c475e7c68f27--musicards-v2.netlify.app",
  "https://604b249fbed03776903944ab--musicards-v2.netlify.app",
  "https://604b25e20745f482061b6b79--musicards-v2.netlify.app",
  "https://604b28b29b8bdd75ec1bda68--musicards-v2.netlify.app",
  "https://musicards-v2.netlify.app",
];
const validCorsOrigin = (origin, callback) => {
  if (whitelist.indexOf(origin) !== -1 || !origin) {
    callback(null, true);
  } else {
    const error = new Error("Not allowed by CORS");
    error.statusCode = 401;
    callback(error);
  }
};
const corsOptions = {
  origin: validCorsOrigin,
  credentials: true,
};

app.use(cors(corsOptions));

app.post("/*", requireJsonContent, (req, res, next) => {
  next();
});
app.put("/*", requireJsonContent, (req, res, next) => {
  next();
});

// ROUTES
app.get("/", (req, res) => {
  res.status(200).send("Server is running");
});

// ROUTERS
const decksRouter = require("./routes/decks.routes");
const usersRouter = require("./routes/users.routes");

app.use("/decks", decksRouter);
app.use("/users", usersRouter);

// ERROR HANDLERS
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  console.log(error.message);
  res.status(error.statusCode).send(error.message);
});

module.exports = app;
