const Deck = require("../models/deck.model");

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

module.exports = { findAll, createOne, findById };
