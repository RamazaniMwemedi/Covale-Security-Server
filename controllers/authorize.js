const authorizationRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { SECRETE } = require("../utils/config");

authorizationRouter.post("/", async (req, res) => {
  const body = req.body;

  console.log("users :>>>", await User.find({}));
  const user = await User.findOne({ email: body.email });
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  };
  console.log(user);
  const secretToken = jwt.sign(userForToken, SECRETE);

  res.status(200).json({
    secretToken,
  });
});

module.exports = authorizationRouter;
