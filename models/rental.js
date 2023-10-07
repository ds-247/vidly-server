const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },
  movieTitle: {
    type: String,
    required: true,
  },
  rentedOn: {
    type: String,
    required: true,
    default: Date.now,
  },
  rate: {
    type: Number,
    required: true,
  },
  returnedOn: { type: String },
  duration: { type: Number },
  rentalFee: { type: Number, min: 0 },
});

const Rental = new mongoose.model("Rental", rentalSchema);

async function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Customer Id must be a valid ObjectId"),
    movieId: Joi.string()
      .required()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Movie Id must be a valid ObjectId"),
    rentedOn: Joi.date(),
    returnedOn: Joi.date().allow(null),
    rentalFee: Joi.number().min(0),
    rate: Joi.number().required().min(1).message(rate),
  });

  try {
    await schema.validateAsync(rental);
  } catch (error) {
    return error;
  }
}

exports.Rental = Rental;
exports.validateRental = validateRental;
