const logger = require("../startup/logger");
const auth = require("../middleware/auth");
const { User, validateUser, hashPassword } = require("../models/user");
const { Movie, validateMovieId } = require("../models/movie");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

router.get("/me", [auth], async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const error = await validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already existed...");

  user = new User(_.pick(req.body, ["name", "password", "email", "contact"]));

  user.likedMovies = [];
  user.rentalHistory = [];
  user.currentRentals = [];

  const plaintextPassword = req.body.password;

  try {
    user.password = await hashPassword(plaintextPassword);
    await user.save();

    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send(_.pick(user, ["name", "email", "contact"]));
  } catch (error) {
    logger.error("Error hashing password:", error);
    return res.status(500).send(`Error creating user: ${error.message}`);
  }
});

router.put("/like/:id", [auth], async (req, res) => {
  const error = await validateMovieId(req.params.id);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Movie does not exists.");

  const userId = req.user._id; // inside the model add user _id property while creating jwt

  let user = await User.findById(userId);
  if (!user) return res.status(404).send("User not found ...");

  user.likedMovies.push(req.params.id);

  await user.save();

  return res.status(200).json({ message: "Movie liked successfully.", user });
});

module.exports = router;
