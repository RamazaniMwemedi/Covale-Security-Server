const Keys = require("../models/keys");
const { generateKeyPairs } = require("../utils/helpers/keys");

const createANewKey = async (request, response) => {
  const { publicKey, privateKey } = await generateKeyPairs();

  const { userId, forModelName, modelId } = request.body;

  const newKeys = new Keys({
    privateKey,
    publicKey,

  });

  response.status(201).json();
};

module.exports = {
  createANewKey,
};
