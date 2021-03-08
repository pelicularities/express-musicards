require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const protectRoute = require("./middleware/protectRoute");
const requireJsonContent = require("./middleware/requireJsonContent");
const app = express();
app.use(express.json());
app.use(cookieParser());

// MIDDLEWARE
app.post("/*", requireJsonContent, (req, res, next) => {
  next();
});
app.put("/*", requireJsonContent, (req, res, next) => {
  next();
});

// ROUTES
app.get("/", (req, res) => {
  res.status(200).send("Hello");
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
