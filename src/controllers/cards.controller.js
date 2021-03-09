const Deck = require("../models/deck.model");
const Card = require("../models/card.model");

// given a deck document, find all cards belonging to that deck
const findAll = async (deck, next) => {
  try {
    return await Card.find({ _id: { $in: deck.cards } });
  } catch (error) {
    next(error);
  }
};

const createOne = async (deckId, body, next) => {
  try {
    const deck = await Deck.findById(deckId);
    const newCard = await Card.create(body);
    if (newCard) {
      deck.cards.push(newCard._id);
      deck.save();
      return newCard;
    }
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
};

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
  findAll,
  createOne,
  findByIdAndUpdate,
  findByIdAndDelete,
};
