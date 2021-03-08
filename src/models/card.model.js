const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const validateCardSides = (sections) => {
  if (!sections) return false;
  if (!sections.length) return false;
  console.log("sections of card", sections);
  // each side is an array of sections
  const isValid = true;
  const validTypes = ["text", "stave", "image", "midi"];
  sections.forEach((section) => {
    if (!validTypes.includes(section.type)) {
      isValid = false;
    }
  });
  return isValid;
};

const cardSchema = new Schema({
  front: {
    type: Array,
    required: true,
    validate: {
      validator: validateCardSides,
      message: "Card content (front) is invalid",
    },
  },
  back: {
    type: Array,
    required: true,
    validate: {
      validator: validateCardSides,
      message: "Card content (back) is invalid",
    },
  },
});

const Card = mongoose.model("Card", cardSchema);
module.exports = Card;
