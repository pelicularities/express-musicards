const requireJsonContent = (req, res, next) => {
  if (req.headers["content-type"] !== "application/json") {
    const error = new Error(
      "Server requires content-type JSON for POST and PUT requests"
    );
    error.statusCode = 400;
    next(error);
  } else {
    next();
  }
};

module.exports = requireJsonContent;
