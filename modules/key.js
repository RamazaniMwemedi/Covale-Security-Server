const { generateKeyPairs } = require("../utils/helpers/keys");
const Keys = require("../models/keys");
const Message = require("../models/message");
const TeamMessage = require("../models/teamMessage");
const User = require("../models/user");
const Team = require("../models/team");
const Chat = require("../models/chat");
const { privateDecrypt, publicEncrypt } = require("crypto");

const getModels = async (modelName, modelId) => {
  let model = null;
  if (modelName === "Chat") {
    return (model = await Chat.findById(modelId));
  } else if (modelName === "Team") {
    return (model = await Team.findById(modelId));
  } else {
    request.status("404").json({
      message: "This model are  not required",
    });
  }
  return model;
};

const createANewKey = async (request, response) => {
  console.log("Generating a new key pair");
  const { publicKey, privateKey } = await generateKeyPairs();
  console.log("Keys are generated");
  const userId = request.user._id;
  if (!userId) {
    return response.status(401).json({
      message: "User not found",
    });
  }
  const { modelName, modelId } = request.body;
  console.log("modelName", modelName);
  console.log("modelId", modelId);

  let model = await getModels(modelName, modelId);
  console.log("model", model);

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
const getAllKeys = async (request, response) => {
  const user = request.user;
  // Get all chats and team ids from the user model and use them to get all keys from the keys model and return them to the user
  const chatsFromUser = await User.findById(user._id).populate("chats");
  const teamsFromUser = await User.findById(user._id).populate("teams");

  const chatsIdsAndModelNames = chatsFromUser.chats.map((chat) => {
    return { modelName: "Chat", modelId: chat._id };
  });
  const teamsIdsAndModelNames = teamsFromUser.teams.map((team) => {
    return { modelName: "Team", modelId: team._id };
  });

  const allKeys = new Array();
  for (let i = 0; i < chatsIdsAndModelNames.length; i++) {
    const element = chatsIdsAndModelNames[i];
    const keys = await Keys.find({
      generatedForModel: element.modelName,
      modelId: element.modelId,
    });
    allKeys.push(...keys);
  }
  for (let i = 0; i < teamsIdsAndModelNames.length; i++) {
    const element = teamsIdsAndModelNames[i];
    const keys = await Keys.find({
      generatedForModel: element.modelName,
      modelId: element.modelId,
    });
    allKeys.push(...keys);
  }
  console.log("allKeys", allKeys);
  response.status(200).json(allKeys);
};
module.exports = {
  createANewKey,
  encryptAMessage,
  decryptAMessage,
  getAllKeys,
};
