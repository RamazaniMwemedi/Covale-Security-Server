const { createANewKey } = require("../modules/key");

const keyRouters = require("express").Router();

// Create a new key
keyRouters.post("/", async (request, response) => {
  await createANewKey(request, response);
});

module.exports = keyRouters;
