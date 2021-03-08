require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const protectRoute = require("./middleware/protectRoute");
const app = express();
app.use(express.json());
app.use(cookieParser());

// MIDDLEWARE
const requireJsonContent = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    const error = new Error(
      "Server requires content-type JSON for POST and PUT requests"
    );
    error.statusCode = 400;
    next(error);
  } else {
    next();
  }
};

app.post("/*", [protectRoute, requireJsonContent], (req, res, next) => {
  next();
});
app.put("/*", [protectRoute, requireJsonContent], (req, res, next) => {
  next();
});
app.delete("/*", protectRoute, (req, res, next) => {
  next();
});

// ROUTES
app.get("/", (req, res) => {
  res.status(200).send("Hello");
});

// ROUTERS
const decksRouter = require("./routes/decks.routes");

app.use("/decks", decksRouter);

// ERROR HANDLERS
app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  console.log(error.message);
  res.status(error.statusCode).send(error.message);
});

module.exports = app;
