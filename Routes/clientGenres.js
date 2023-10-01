const { Genre, validateGenreId } = require("../models/genre");
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

module.exports = router;