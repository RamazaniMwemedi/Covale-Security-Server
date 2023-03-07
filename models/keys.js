const mongoose = require("mongoose");
const { MAIN_SERVER_URI } = require("../utils/config");

mongoose
  .connect(MAIN_SERVER_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
  });

//   Key schema
const keysSchema = new mongoose.Schema({
  privateKey: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  generatedByUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  generatedForModel: {
    type: String,
    enum: ["Chat", "Team"],
    required: true,
  },
  modelId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

keysSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Keys", keysSchema);

// Path: model\key.js
