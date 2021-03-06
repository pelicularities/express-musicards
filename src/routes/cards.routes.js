const express = require("express");
const router = express.Router();
const authorizeUser = require("../middleware/authorizeUser");
const cardsController = require("../controllers/cards.controller");

// ROUTES
router.get("/", async (req, res, next) => {
  const cards = await cardsController.findAll(req.deck, next);
  res.status(200).send(cards);
});

router.post("/", authorizeUser, async (req, res, next) => {
  const newCard = await cardsController.createOne(req.deckId, req.body, next);
  if (newCard) res.status(201).send(newCard);
});

router.put("/:cardId", authorizeUser, async (req, res, next) => {
  const updatedCard = await cardsController.findByIdAndUpdate(
    req.params.cardId,
    req.body,
    next
  );
  if (updatedCard) res.status(200).send(updatedCard);
});

router.delete("/:cardId", authorizeUser, async (req, res, next) => {
  const deletedCard = await cardsController.findByIdAndDelete(
    req.params.cardId,
    req.deckId,
    next
  );
  res.status(200).send(deletedCard);
});

module.exports = router;
