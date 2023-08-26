const Joi = require("joi");
const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: new mongoose.Schema({
      name: { type: String, minlength: 3, maxlength: 50, required: true },
      isGold: {
        required: true,
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
        validate: {
          validator: function (v) {
            return /^[0-9]{5}$/.test(v);
          },
          message: (props) => `${props.value} is not a valid phone number!`,
        },
      },
    }),
    require: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: { type: String, required: true, minlength: 3, maxlength: 20 },
      dailyRentalRate: { type: Number, required: true, min: 0, max: 100 },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: { type: Date },
  rentalFee: { type: Number, min: 0 },
});

const Rental = new mongoose.model("Rental", rentalSchema);

async function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Customer Id must be a valid ObjectId"),
    movieId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message("Movie Id must be a valid ObjectId"),
  });

  try {
    await schema.validateAsync(rental);
    
  } catch (error) {
    return error;
  }
}

exports.Rental = Rental;
exports.validateRental = validateRental;
