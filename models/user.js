const Joi = require("joi");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin, name: this.name },
    secretKey
  );
  return token;
};

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

async function hashPassword(password) {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

async function checkPassword(inputPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw error;
  }
}

exports.User = User;
exports.validateUser = validateUser;
exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;
