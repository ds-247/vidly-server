const Joi = require('joi');
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.post("/", async (req, res) => {
  const error = await validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid user name or password...");

  const validPassword = await bcrypt.compare(req.body.password,user.password);
  if(!validPassword) return res.status(400).send("Invalid user name or password...");;

  res.send(true);
});

async function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string()
      .required()
      .email()
      .message("email must be a valid and unique"),
    password: Joi.string()
      .required()
      .min(5)
      .message("password must be atleast 5 characters"),
  });

  try {
    await schema.validateAsync(user);
  } catch (err) {
    return err;
  }
}

module.exports = router;
