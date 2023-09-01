const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const { Genre, validateGenre, validateGenreId } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const allGenres = await Genre.find().sort("name");
  res.status(200).send(allGenres);
});

router.get("/:id", async (req, res) => {
  const error = await validateGenreId(req.params.id);
  if (error) return res.status(400).send(err.details[0].message);

  const genre = await Genre.find({ _id: req.params.id });
  if (!genre) return res.status(400).send("Genre doesn't existed...");

  res.status(200).send(genre);
});

router.post("/", async (req, res) => {
  const error = await validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newGenre = new Genre({
    name: req.body.name,
  });

  const result = await newGenre.save();
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const err = await validateGenreId(req.params.id);
  if (err) return res.status(400).send(err.details[0].message);

  const genre = await Genre.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  const error = await validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.set({
    name: req.body.name,
  });

  await genre.save();

  res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const err = await validateGenreId(req.params.id);
  if (err) return res.status(400).send(err.details[0].message);

  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.status(200).send(genre);
});

module.exports = router;
