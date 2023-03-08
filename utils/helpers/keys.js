const { generateKeyPairSync } = require("node:crypto");

const generateKeyPairs = async () => {
  const { publicKey, privateKey } = generateKeyPairSync("rsa", {
    modulusLength: 8400,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      // cipher: "aes-256-cbc",
      // passphrase: "top secret",
    },
  });

  return { publicKey, privateKey };
};

module.exports = { generateKeyPairs };
// Path: utils\index.js
