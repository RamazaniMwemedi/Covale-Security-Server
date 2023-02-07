require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const SECRETE = process.env.SECRETE;
module.exports = {
  PORT,
  MONGODB_URI,
  SECRETE,
};
