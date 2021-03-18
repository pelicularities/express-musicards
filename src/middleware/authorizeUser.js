const ObjectId = require("mongodb").ObjectId;

const authorizeUser = (req, res, next) => {
  if (!req.user) {
    const error = new Error("You are not authorized");
    error.statusCode = 401;
    next(error);
  }
  if (!req.deck) {
    const error = new Error("Invalid deck ID");
    error.statusCode = 422;
    next(error);
  }
  if (ObjectId(req.deck.userId).toString() !== req.user.id) {
    const error = new Error("You do not have permission to modify this deck");
    error.statusCode = 403;
    next(error);
  } else {
    next();
  }
};

module.exports = authorizeUser;
