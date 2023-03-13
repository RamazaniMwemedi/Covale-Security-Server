const { createANewKey, getAllKeys, encryptAMessage } = require("../modules/key");

const keyRouters = require("express").Router();

// Create a new key
keyRouters.post("/generate", async (request, response) => {
  await createANewKey(request, response);
});

// Get all keys
keyRouters.get("/", async (request, response) => {
  await getAllKeys(request, response);
});

// Encrypt a message
keyRouters.post("/encrypt", async (request, response) => {
  await encryptAMessage(request, response);
});

module.exports = keyRouters;
