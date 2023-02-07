const mongoose = require("mongoose");
const { MONGODB_URI } = require("../utils/config");

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
  });

const teamMessageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  idFromClient: {
    type: String,
  },
  message: {
    type: String,
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
  file: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: [],
    },
  ],
  teamRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  topicRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Topic",
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TeamMessage", teamMessageSchema);

teamMessageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
