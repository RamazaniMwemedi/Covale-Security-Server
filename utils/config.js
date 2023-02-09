require("dotenv").config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const SECRETE = process.env.SECRETE;
const MAIN_SERVER_URI = process.env.MAIN_SERVER_URI;
console.log("MONGODB_URI: ", MONGODB_URI);
console.log("MAIN_SERVER_URI: ", MAIN_SERVER_URI);
module.exports = {
  PORT,
  MONGODB_URI,
  SECRETE,
  MAIN_SERVER_URI,
};
