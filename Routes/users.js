const auth = require('../middleware/auth');
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/me", auth, async (req,res)=>{
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
})

router.post("/", async (req, res) => {
  const error = await validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already existed...");

  user = new User(_.pick(req.body, ["name", "password", "email"]));

  const saltRounds = 10;
  user.password = await bcrypt.hash(user.password, saltRounds);

  await user.save(); 

  const token = user.generateAuthToken();
  res.header('x-auth-token',token).send(_.pick(user, ["name", "email"]));
});

module.exports = router;
