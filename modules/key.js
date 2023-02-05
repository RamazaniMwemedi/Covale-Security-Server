const Key = require("../model/key");
const { generateKeyPairs } = require("../utils/helpers/keys");

const createANewKey = async (request, response) => {
  const { publicKey, privateKey } = await generateKeyPairs();
  console.log(publicKey);
};

module.exports = {
  createANewKey,
};
