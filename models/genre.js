const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

async function validateGenreId(genreId) {
  const schema = Joi.object({
    genreId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Genre Id must be valid objectId"),
  });

  try {
    await schema.validateAsync({ genreId });
  } catch (error) {
    return error;
  }
}

async function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  try {
    await schema.validateAsync(genre);
  } catch (err) {
    return err;
  }
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.validateGenreId = validateGenreId;
