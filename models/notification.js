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

const notificationSchema = mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  subject: {
    type: String,
  },
  preview: {
    type: String,
  },
  time: {
    type: Date,
    required: true,
    default: Date.now,
  },
  read: {
    type: Boolean,
    required: true,
    default: false,
  },
  token: {
    type: String,
  },
  priority: {
    type: Number,
    required: true,
    default: 0,
  },
});

notificationSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
