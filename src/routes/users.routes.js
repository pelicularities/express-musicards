const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

// ROUTES

router.post("/", async (req, res, next) => {
  const newUser = await usersController.createOne(req.body, next);
  if (newUser) {
    res.status(201).send(newUser);
  }
});

module.exports = router;
