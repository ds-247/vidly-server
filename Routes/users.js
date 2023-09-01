const logger = require("../startup/logger");
const auth = require("../middleware/auth");

const { User, validateUser, hashPassword } = require("../models/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const error = await validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already existed...");

  user = new User(_.pick(req.body, ["name", "password", "email"]));

  const plaintextPassword = req.body.password;
  try {
    user.password = await hashPassword(plaintextPassword);
    await user.save();

    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["name", "email"]));
  } catch (error) {
    logger.error("Error hashing password:", error);
    return res.status(500).send("Something Wrong happened Try again");
  }
});

module.exports = router;
