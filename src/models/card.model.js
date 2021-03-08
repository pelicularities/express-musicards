const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cardSchema = new Schema({
  front: {
    type: Array,
    required: true,
  },
  back: {
    type: Array,
    required: true,
  },
});

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
