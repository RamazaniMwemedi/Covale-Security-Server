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
const { generateKeyPairs } = require("./utils/helpers/keys");
const { encryptAMessage, decryptAMessage } = require("./modules/key");
const zlib = require("zlib");
const teamMessage = require("./models/teamMessage");
app.use(cors());

app.use(express.static("public"));
app.use(express.json());

app.use("/api/v1/authorization", authorizationRouter);

app.use(requestLogger);
// Authorization middleware

app.use(tokenExtractor);
app.use(userExtractor);

// Endpoints
app.use("/api/v1/keys", keyRouters);
app.use("/api", async (req, res) => {
  const allTeamMessages = await teamMessage.find();
  res.json(allTeamMessages);
});
app.use("/api/v1/keys", keyRouters);

// Error middleware

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
