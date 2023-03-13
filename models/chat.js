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

const chatSchema = mongoose.Schema({
  messege: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: [],
    },
  ],
  createdBY: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  colleague: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  block: {
    type: Boolean,
    default: false,
  },
  blockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  blocker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);

chatSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
