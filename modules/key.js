const { generateKeyPairs } = require("../utils/helpers/keys");
const Keys = require("../models/keys");
const Message = require("../models/message");
const TeamMessage = require("../models/teamMessage");
const User = require("../models/user");
const { privateDecrypt, publicEncrypt } = require("crypto");
const message = require("../models/message");

const createANewKey = async (request, response) => {
  const { publicKey, privateKey } = await generateKeyPairs();
  const userId = request.user._id;
  if (!userId) {
    return response.status(401).json({
      message: "User not found",
    });
  }
  const { modelName, modelId } = request.body;

  let model = null;
  if (modelName === "Chat") {
    return (model = await Message.findById(modelId));
  } else if (modelName === "Team") {
    return (model = await TeamMessage.findById(modelId));
  } else {
    request.status("404").json({
      message: "This model are  not required",
    });
  }
  if (userId && model) {
    const newKeys = new Keys({
      privateKey,
      publicKey,
      generatedByUserId: userId,
      generatedForModel: modelName,
      modelId: model._id,
    });

    const savedKeys = await newKeys.save();
    // Return the keys cleaded whithout line breakes
    console.log("savedKeys", savedKeys);
    response.status(201).json(savedKeys);
  } else {
    response.status(404).json({
      message: "User or model not found",
    });
  }
};

const encryptAMessage = async (publicKey, req, message, teamId) => {
  console.log("Encrypting a message");
  const encryptedMessage = publicEncrypt(publicKey, message);
  const user = req.user;
  const newTeamMessage = new TeamMessage({
    sender: user._id,
    message: encryptedMessage.toString("base64"),
    teamRoom: teamId,
  });
  const savedTeamMessage = await newTeamMessage.save();
  return savedTeamMessage;
};

const decryptAMessage = async (privateKey, teamMessage) => {
  console.log("Decrypting a message");
  const decryptedMessage = privateDecrypt(
    privateKey,
    Buffer.from(teamMessage.message, "base64")
  );
  console.log("decryptedMessage", decryptedMessage.toString("utf8"));
  const decryptedTeamMessage = {
    sender: teamMessage.sender,
    message: decryptedMessage.toString("utf8"),
    teamRoom: teamMessage.teamRoom,
  };

  return decryptedTeamMessage;
};

module.exports = {
  createANewKey,
  encryptAMessage,
  decryptAMessage,
};
