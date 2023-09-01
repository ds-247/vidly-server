const Joi = require("joi");
const { User, checkPassword } = require("../models/user");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.post("/", async (req, res) => {
  const error = await validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid user name or password...");

  const inputPassword = req.body.password;
  const storedHashedPassword = user.password;

  checkPassword(inputPassword, storedHashedPassword)
    .then((isMatch) => {
      if (isMatch) {
        const token = user.generateAuthToken();
        res.send({ token });
      } else {
        return res.status(400).send("Invalid user name or password...");
      }
    })
    .catch((error) => {
      logger.error("Error checking password:", error);
    });
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
