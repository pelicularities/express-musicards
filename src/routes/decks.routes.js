const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");
const decksController = require("../controllers/decks.controller");

// MIDDLEWARE
router.post("/*", protectRoute, (req, res, next) => {
  next();
});
router.put("/*", protectRoute, (req, res, next) => {
  next();
});
router.delete("/*", protectRoute, (req, res, next) => {
  next();
});

// ROUTES
router.get("/", async (req, res, next) => {
  const decks = await decksController.findAll(next);
  res.status(200).send(decks);
});

router.get("/:deckId", async (req, res, next) => {
  const deck = await decksController.findById(req.params.deckId, next);
  res.status(200).send(deck);
});

router.post("/", async (req, res, next) => {
  const newDeck = await decksController.createOne(req.body, next);
  if (newDeck) res.status(201).send(newDeck);
});

router.put("/:deckId", async (req, res, next) => {
  const updatedDeck = await decksController.findByIdAndUpdate(
    req.params.deckId,
    req.body,
    next
  );
  if (updatedDeck) res.status(200).send(updatedDeck);
});

module.exports = router;
