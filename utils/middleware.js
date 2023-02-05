const jwt = require("jsonwebtoken");

const logger = require("./logger");
const config = require("./config");
// const User = require("../models/user");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message, "Error name is ", error.name, "Ramazani");

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(406).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  } else if (error.name === "MongoServerError") {
    return response.status(500).json({
      error: error.message,
    });
  }
  next(error);
};

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

const tokenExtractor = (req, res, next) => {
  const token = getTokenFrom(req);
  req.token = token;
  next();
};

// const userExtractor = async (req, res, next) => {
//   const decodedToken = jwt.verify(req.token, config.SECRETE);
//   if (!decodedToken.id) {
//     return res.status(401).json({ error: "token missing or invalid" });
//   } else {
//     const user = await User.findById(decodedToken.id);
//     req.user = user;
//     next();
//   }
// };

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  // userExtractor,
};
