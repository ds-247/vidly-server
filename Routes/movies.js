const { Movie, validateMovie, validateMovieId } = require("../models/movie");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const allMovies = await Movie.find().sort("title");
  res.status(200).send(allMovies);
});

router.get("/:id", async (req, res) => {
  const err = await validateMovieId(req.params.id);
  if (err) return res.status(400).send("Invalid Movie Id...");

  const customer = await Movie.find({ _id: req.params.id });
  if (!customer) res.status(400).send("Movie doesn't existed...");
  res.status(200).send(customer);
});

router.post("/", async (req, res) => {
  const error = await validateMovie(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) res.status(400).send(err.details[0].message);

  const newMovie = new Movie({
    title: req.body.title,
    genre: genre,
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
  });

  const result = await newMovie.save();
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const err = await validateMovieId(req.params.id);
  if (err) return res.status(400).send("Invalid Movie Id...");

  const movie = await Movie.findById(req.params.id);
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  const error = await validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) res.status(400).send(err.details[0].message);

  movie.set({
    title: req.body.title,
    genre: genre,
    dailyRentalRate: req.body.dailyRentalRate,
    numberInStock: req.body.numberInStock,
  });

  await movie.save();

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  const err = await validateMovieId(req.params.id);
  if (err) return res.status(400).send(err.details[0].message);

  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.status(200).send(movie);
});

module.exports = router;