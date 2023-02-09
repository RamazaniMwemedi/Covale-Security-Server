const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const keyRouters = require("./controllers/keyRouters");
const authorizationRouter = require("./controllers/authorize");
const {
  errorHandler,
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
} = require("./utils/middleware");

app.use(cors());

app.use(express.static("build"));
app.use(express.json());

app.use("/api/authorization", authorizationRouter);

app.use(requestLogger);
// Authorization middleware
app.use(tokenExtractor);
app.use(userExtractor);

// Endpoints

app.use("/api/keys", keyRouters);

// Error middleware

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
