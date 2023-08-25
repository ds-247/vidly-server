const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

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

exports.Genre = Genre;
exports.validateGenre = validateGenre;
