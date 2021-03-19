const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");
const usersController = require("../controllers/users.controller");
const bcrypt = require("bcryptjs");
const createJWTToken = require("../utils/jwt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// HELPER FUNCTIONS
const setCookie = (userId, username, res) => {
  const token = createJWTToken(userId, username);

  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = oneDay * 7;
  const expiryDate = new Date(Date.now() + oneWeek);

  res.cookie("token", token, {
    expires: expiryDate,
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return token;
};

// ROUTES
router.post("/", async (req, res, next) => {
  const newUser = await usersController.createOne(req.body, next);
  if (newUser) {
    const token = setCookie(newUser._id, newUser.username, res);
    req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    res.status(201).send(req.user);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      const err = new Error("Invalid login credentials");
      err.statusCode = 401;
      next(err);
    } else {
      const token = setCookie(user._id, user.username, res);
      req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);
      res.status(200).send(req.user);
    }
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.get("/logout", async (req, res, next) => {
  // const domain = process.env.DOMAIN_URI || "localhost";
  res
    .clearCookie("token", { sameSite: "None" })
    .send("You are now logged out!");
});

router.get("/me", protectRoute, async (req, res, next) => {
  res.status(200).send(req.user);
});

module.exports = router;
