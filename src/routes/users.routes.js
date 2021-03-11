const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const bcrypt = require("bcryptjs");
const createJWTToken = require("../utils/jwt");
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
};

// ROUTES
router.post("/", async (req, res, next) => {
  const newUser = await usersController.createOne(req.body, next);
  if (newUser) {
    console.log(newUser);
    setCookie(newUser._id, newUser.username, res);
    res.status(201).send(newUser);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      const err = new Error("Invalid login credentials");
      err.statusCode = 401;
      next(err);
    } else {
      setCookie(user._id, user.username, res);
      res.status(200).send("You are now logged in!");
    }
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

router.post("/logout", async (req, res, next) => {
  res
    .clearCookie("token", {
      path: "/",
      domain: "express-musicards-test.herokuapp.com",
    })
    .send("You are now logged out!");
});

module.exports = router;
