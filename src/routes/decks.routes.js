const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");
const cardsRouter = require("../routes/cards.routes");
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
  const newDeck = await decksController.createOne(req.user, req.body, next);
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

router.delete("/:deckId", async (req, res, next) => {
  const deletedDeck = await decksController.findByIdAndDelete(
    req.params.deckId,
    next
  );
  res.status(200).send(deletedDeck);
});

// NESTED CARDS ROUTER
router.use(
  "/:deckId/cards",
  async (req, res, next) => {
    req.deckId = req.params.deckId;
    req.deck = await decksController.findById(req.params.deckId, next);
    next();
  },
  cardsRouter
);

module.exports = router;
