const mongoose = require("mongoose");
const { MAIN_SERVER_URI } = require("../utils/config");

mongoose.connect(MAIN_SERVER_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB: ", err);
  });

const messageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      default: [],
    },
  ],
  chatRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  idFromClient: {
    type: String,
  },
});

module.exports = mongoose.model("Message", messageSchema);

messageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});
