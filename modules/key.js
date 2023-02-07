const { generateKeyPairs } = require("../utils/helpers/keys");
const Keys = require("../models/keys");
const Message = require("../models/message");
const TeamMessage = require("../models/teamMessage");
const User = require("../models/user");

const createANewKey = async (request, response) => {
  const { publicKey, privateKey } = await generateKeyPairs();

  const { userId, modelName, modelId } = request.body;

  let model;
  if (modelName === "Message") {
    model = await Message.findById(modelId);
  } else if (modelName === "TeamMessage") {
    model = await TeamMessage.findById(modelId);
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

  const user = await User.findById(userId);
  if (user && model) {
    const newKeys = new Keys({
      privateKey,
      publicKey,
      generatedByUserId: user._id,
      generatedForModel: modelName,
      modelId: model._id,
    });

    const savedKeys = await newKeys.save();

    response.status(201).json(savedKeys);
  }
};

module.exports = {
  createANewKey,
};
