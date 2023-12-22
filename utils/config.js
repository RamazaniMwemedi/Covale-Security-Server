require("dotenv").config();

const PORT = process.env.PORT || 5000;

const getDBURI = (envMode) => {
  switch (envMode) {
    case "development":
      return process.env.DEV_MONGODB_URI;
    case "production":
      return process.env.DEV_MONGODB_URI;

    case "test":
      return process.env.DEV_MONGODB_URI;
    default:
      return process.env.DEV_MONGODB_URI;
  }
};
const MONGODB_URI = getDBURI(process.env.NODE_ENV);

const SECRETE = process.env.SECRETE;
module.exports = {
  PORT,
  MONGODB_URI,
  SECRETE,
};
