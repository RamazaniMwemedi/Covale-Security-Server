const { createANewKey } = require("../modules/key");

const keyRouters = require("express").Router();

// Create a new key
keyRouters.post("/generate", async (request, response) => {
  await createANewKey(request, response);
});

// Encrypt a message
keyRouters.post("/encrypt", async (request, response) => {
  await encryptAMessage(request, response);
});

module.exports = keyRouters;
