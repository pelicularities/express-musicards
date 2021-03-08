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

const createOne = async (body, next) => {
  try {
    const newDeck = await Deck.create(body);
    if (newDeck) return newDeck;
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
};

const createOneCard = async (id, body, next) => {
  try {
    const deck = await Deck.findById(id);
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
    if (deletedDeck) return deletedDeck;
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findAll,
  createOne,
  createOneCard,
  findById,
  findByIdAndUpdate,
  findByIdAndDelete,
};
