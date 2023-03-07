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
  console.log("Type of keys", typeof publicKey, typeof privateKey);
  console.log("userId", userId);
  const { modelName, modelId } = request.body;

  let model;
  if (modelName === "Chat") {
    model = await Message.findById(modelId);
    console.log(model);
  } else if (modelName === "Team") {
    model = await TeamMessage.findById(modelId);
    console.log(model);
  } else {
    request.status("404").json({
      message: "This model are  not required",
    });
  }

  if (!userId) {
    request.status("401").json({
      message: "User id is not passed",
    });
  }

  if (userId) {
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
  }
};

const encryptAMessage = async (publicKey, req, teamId) => {
  const encryptedMessage = publicEncrypt(
    publicKey,
    Buffer.from(req.body.message)
  );
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
