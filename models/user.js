const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 5,
  },
});

const User = new mongoose.model("User", userSchema);

async function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(3)
      .max(50)
      .message("Name is required and must be atleast 3 characters long"),
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

exports.User = User;
exports.validateUser = validateUser;
