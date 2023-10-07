const { Movie, validateMovieId } = require("../models/movie");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const allMovies = await Movie.find().sort("title");
  res.status(200).send(allMovies);
});

router.get("/:id", async (req, res) => {
  const err = await validateMovieId(req.params.id);
  if (err) return res.status(400).send("Invalid Movie Id...");

  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(400).send("Movie doesn't existed...");
  res.status(200).send(movie);
});

module.exports = router;
