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

//   Key schema
const keySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  keyType: {
    type: String,
    required: true,
  },
  keySize: {
    type: Number,
    required: true,
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

keySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Key", keySchema);

// Path: model\key.js
