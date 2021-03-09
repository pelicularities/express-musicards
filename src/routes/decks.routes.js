const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");
const decksController = require("../controllers/decks.controller");
const cardsController = require("../controllers/cards.controller");

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

router.post("/:deckId/cards", async (req, res, next) => {
  const newCard = await cardsController.createOne(
    req.params.deckId,
    req.body,
    next
  );
  if (newCard) res.status(201).send(newCard);
});

router.put("/:deckId", async (req, res, next) => {
  const updatedDeck = await decksController.findByIdAndUpdate(
    req.params.deckId,
    req.body,
    next
  );
  if (updatedDeck) res.status(200).send(updatedDeck);
});

// will refactor into separate cards.routes later
router.put("/:deckId/cards/:cardId", async (req, res, next) => {
  const updatedCard = await cardsController.findByIdAndUpdate(
    req.params.cardId,
    req.body,
    next
  );
  if (updatedCard) res.status(200).send(updatedCard);
});

router.delete("/:deckId", async (req, res, next) => {
  const deletedDeck = await decksController.findByIdAndDelete(
    req.params.deckId,
    next
  );
  res.status(200).send(deletedDeck);
});

// will refactor into separate cards.routes later
router.delete("/:deckId/cards/:cardId", async (req, res, next) => {
  const deletedCard = await cardsController.findByIdAndDelete(
    req.params.cardId,
    req.params.deckId,
    next
  );
  res.status(200).send(deletedCard);
});

module.exports = router;
