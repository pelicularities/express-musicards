const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deckSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  cards: {
    type: Array,
    required: true,
    default: [],
  },
});

const Deck = mongoose.model("Deck", deckSchema);
module.exports = Deck;
