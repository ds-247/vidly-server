const Joi = require("joi");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

router.get("/", async (req, res) => {
  const allGenres = await Genre.find().sort('name');
  res.status(200).send(allGenres);
});

router.get("/:id", async (req, res) => {
  const genre = await Genre.find({ _id: req.params.id });
  if (!genre) res.status(400).send("Genre doesn't existed...");
  res.status(200).send(genre);
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newGenre = new Genre({
    name: req.body.name,
  });

  const result = await newGenre.save();
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.set({
    name: req.body.name,
  });

  await genre.save();

  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.status(200).send(genre);
});

async function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  try {
    return await schema.validateAsync(genre);
  } catch (error) {
    throw error;
  }
}

module.exports = router;
