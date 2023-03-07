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

app.use(cors());

app.use(express.static("build"));
app.use(express.json());

app.use("/api/v1/authorization", authorizationRouter);

app.use(requestLogger);
// Authorization middleware

app.use(tokenExtractor);
app.use(userExtractor);

// Endpoints
app.use("/api/v1/test", async (req, res) => {
  const user = req.user;
  const { publicKey, privateKey } = await generateKeyPairs();
  console.log("Public key", publicKey);
  console.log("Private key", privateKey);
  const encrypt = await encryptAMessage(
    publicKey,
    req,
    "6406b7e3e41232b33ce703cb"
  );
  // Type of encrypt is Buffer
  console.log("encrypt", encrypt);

  const decrypt = await decryptAMessage(privateKey, encrypt);
  console.log("decrypt", decrypt);

  res.json({ message: decrypt });
});
app.use("/api/v1/keys", keyRouters);

// Error middleware

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
