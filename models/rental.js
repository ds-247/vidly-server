const Joi = require("joi");
// const { User } = require("./user");
// const { Movie } = require('./movie');
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  },
  rentedOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  returnedOn: { type: Date },
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
  });

  try {
    await schema.validateAsync(rental);
  } catch (error) {
    return error;
  }
}

exports.Rental = Rental;
exports.validateRental = validateRental;