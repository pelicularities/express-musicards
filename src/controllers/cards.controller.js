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

module.exports = {
  findByIdAndUpdate,
};
