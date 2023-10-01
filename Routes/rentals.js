const { validateRental, Rental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  const allRentals = await Rental.find().sort("-dateOut");
  res.send(allRentals);
});

// router.post("/", async (req, res) => {
//   const error = await validateRental(req.body);
//   if (error) res.status(400).send(error.details[0].message);

//   const customer = await Customer.findById(req.body.customerId);
//   if (!customer) return res.status(400).send("Invalid Customer Id...");

//   const movie = await Movie.findById(req.body.movieId);
//   if (!movie) return res.status(400).send("Invalid Movie Id...");

//   if (movie.numberInStock === 0) return res.send("Out of Stock...");

//   let newRental = new Rental({
//     customer: {
//       _id: customer._id,
//       name: customer.name,
//       isGold: customer.isGold,
//       phone: customer.phone,
//     },
//     movie: {
//       _id: movie._id,
//       title: movie.title,
//       dailyRentalRate: movie.dailyRentalRate,
//     },
//   });

//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     await newRental.save();

//     movie.numberInStock--;
//     await movie.save();

//     await session.commitTransaction();
//     session.endSession();

//     res.send(newRental);
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(400).send(error.message);
//   }
// });

module.exports = router;
