const User = require("../models/user.model");

const createOne = async (body, next) => {
  try {
    const newUser = await User.create(body);
    if (newUser) return newUser;
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
};

module.exports = { createOne };
