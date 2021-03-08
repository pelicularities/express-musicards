const Deck = require("../models/deck.model");

const findAll = async (next) => {
  try {
    return await Deck.find({});
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

module.exports = { findAll, createOne };
