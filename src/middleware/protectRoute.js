const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      const error = new Error("You are not authorized");
      error.statusCode = 401;
      next(error);
    } else {
      req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
      next();
    }
  } catch (error) {
    error.statusCode = 401;
    next(err);
  }
};

module.exports = protectRoute;
