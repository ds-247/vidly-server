const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 500,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
});

const Movie = new mongoose.model("Movie", movieSchema);

async function validateMovieId(movieId) {
  const schema = Joi.object({
    movieId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Movie Id must be a valid ObjectId"),
  });

  try {
    await schema.validateAsync({ movieId });
  } catch (error) {
    return error;
  }
}

async function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genreId: Joi.string().required(),
    dailyRentalRate: Joi.number().integer().min(0).max(500).required(),
    numberInStock: Joi.number().min(0).max(100),
  });

  try {
    await schema.validateAsync(movie);
  } catch (error) {
    return error;
  }
}

exports.Movie = Movie;
exports.movieSchema = movieSchema;
exports.validateMovie = validateMovie;
exports.validateMovieId = validateMovieId;
