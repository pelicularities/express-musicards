const Deck = require("../models/deck.model");
const Card = require("../models/card.model");

const findByIdAndUpdate = async (id, body, next) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (updatedCard) return updatedCard;
    const error = new Error("Card not found");
    error.statusCode = 404;
    next(error);
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
};

const findByIdAndDelete = async (cardId, deckId, next) => {
  try {
    const deckToUpdate = await Deck.findById(deckId);
    const cardToRemove = deckToUpdate.cards.indexOf(cardId);
    deckToUpdate.cards.splice(cardToRemove, 1);
    deckToUpdate.save();
    const deletedCard = await Card.findByIdAndDelete(cardId);
    if (deletedCard) return deletedCard;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findByIdAndUpdate,
  findByIdAndDelete,
};
