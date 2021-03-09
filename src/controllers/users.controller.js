const User = require("../models/user.model");

const createOne = async (body, next) => {
  try {
    console.log("in the users controller: createOne try branch");
    const newUser = await User.create(body);
    if (newUser) return newUser;
    console.log("trying my luck");
  } catch (error) {
    error.statusCode = 422;
    next(error);
  }
};

module.exports = { createOne };
