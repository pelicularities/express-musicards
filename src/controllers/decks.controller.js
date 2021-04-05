const Deck = require("../models/deck.model");
const Card = require("../models/card.model");

const findAll = async (next) => {
  try {
    return await Deck.find({});
  } catch (error) {
    next(error);
  }
};
const findById = async (id, next) => {
  try {
    const deck = await Deck.findById(id);
    if (deck) return deck;
    const error = new Error("Deck not found!");
    error.statusCode = 404;
    next(error);
  } catch (error) {
    next(error);
  }
};

const createOne = async (user, body, next) => {
  try {
    body.userId = user.id;
    body.username = user.name;
    const newDeck = await Deck.create(body);
    if (newDeck) return newDeck;
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
};

const findByIdAndUpdate = async (id, body, next) => {
  try {
    const updatedDeck = await Deck.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (updatedDeck) return updatedDeck;
    const error = new Error("Deck not found");
    error.statusCode = 404;
    next(error);
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
};

const findByIdAndDelete = async (id, next) => {
  try {
    const deletedDeck = await Deck.findByIdAndDelete(id);
    if (deletedDeck) {
      deletedDeck.cards.forEach(async (cardId) => {
        await Card.findByIdAndDelete(cardId);
      });
      return deletedDeck;
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findAll,
  createOne,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete,
};
