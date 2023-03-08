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

app.use(express.static("build"));
app.use(express.json());

app.use("/api/v1/authorization", authorizationRouter);

app.use(requestLogger);
// Authorization middleware

app.use(tokenExtractor);
app.use(userExtractor);

// Endpoints
app.use("/api/v1/test", async (req, res) => {
  const options = {
    level: 9,
  };
  async function compressString(inputString) {
    return new Promise((resolve, reject) => {
      zlib.deflate(inputString, options, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          const compressedString = buffer.toString("base64");
          console.log(`Original string length: ${inputString.length}`);
          console.log(`Compressed string length: ${compressedString.length}`);
          resolve(compressedString);
        }
      });
    });
  }

  async function decompressString(compressedString) {
    const compressedBuffer = Buffer.from(compressedString, "base64");
    return new Promise((resolve, reject) => {
      zlib.inflate(compressedBuffer, (err, buffer) => {
        if (err) {
          reject(err);
        } else {
          const decompressedString = buffer.toString();
          resolve(decompressedString);
        }
      });
    });
  }

  async function main() {
    // const inputString = "This is a string to compress";
    const compressedString = await compressString(req.body.message);
    // console.log(`Compressed string length: ${compressedString.length}`);
    // console.log(compressedString);

    const user = req.user;
    const { publicKey, privateKey } = await generateKeyPairs();
    if (publicKey && privateKey) {
      console.log("Keys are generated");
    }
    const encrypt = await encryptAMessage(
      publicKey,
      req,
      compressedString,
      "6406b7e3e41232b33ce703cb"
    );
    // Type of encrypt is Buffer
    const decrypt = await decryptAMessage(privateKey, encrypt);
    // console.log("decrypt", decrypt);
    console.log(
      "decrypt.message == compressedString",
      decrypt.message == compressedString
    );
    const decompressedString = await decompressString(decrypt.message);

    res.json({ message: decompressedString });
  }
  main().catch((err) => console.error(err));
});
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
