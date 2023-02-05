const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const keyRouters = require("./controllers/keyRouters");
const {
  errorHandler,
  requestLogger,
  unknownEndpoint,
} = require("./utils/middleware");

app.use(cors());

app.use(express.static("build"));
app.use(express.json());
app.use(requestLogger);

app.use("/api/keys", keyRouters);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
