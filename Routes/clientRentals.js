const logger = require("../startup/logger");
const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");
const { User, validateUser, hashPassword } = require("../models/user");
const { Movie, validateMovie, validateMovieId } = require("../models/movie");
const express = require("express");
const router = express.Router();
const _ = require("lodash");

// Rent a movie
router.put("/rent/:id", [auth], async (req, res) => {
  const error = await validateMovieId(req.params.id);
  if (error) res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.params.id);
  if (!movie) res.status(404).send("Movie does not exist.");

  const userId = req.user._id; // Inside the model, add user _id property while creating jwt

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found." });

  const { numberInStock } = movie;
  if (numberInStock === 0) res.send("Out of Stock...");

  const curRentalArray = user.currentRentals;

  // Filter the array to check if the movie is already rented
  const alreadyRented = curRentalArray.find(
    (arr) => arr.movie.toString() === req.params.id
  );

  if (alreadyRented)
    return res.status(400).json({ error: "Movie is already rented..." });

  const newRental = new Rental({
    userId: userId,
    movieId: req.params.id,
    rentedOn: Date.now(),
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await newRental.save();

    movie.numberInStock--;
    await movie.save();

    user.currentRentals.push({
      movie: req.params.id,
      rentedOn: Date.now,
      rentalId: newRental._id,
    });
    await user.save();

    res.status(200).send(newRental);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error("error while renting movie ", error.message);
    res.status(400).send(error.message);
  }
});

// Return a movie
router.put("/return/:id", [auth], async (req, res) => {
  const error = await validateMovieId(req.params.id);
  if (error) res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.params.id);
  if (!movie) res.status(404).send("Movie does not exists.");

  const userId = req.user._id;
  let user = await User.findById(userId);
  if (!user) res.status(404).send("User not found ...");

  const curRentalArray = user.currentRentals;

  // Filter the array to check if the movie is already rented
  const alreadyRented = curRentalArray.find(
    (arr) => arr.movie.toString() === req.params.id
  );

  if (!alreadyRented)
    return res.status(400).json({ error: "Movie is not rented..." });

  const rentalId = alreadyRented.rental;

  const rental = await Rental.findById(rentalId);
  if (!rental) return res.status(404).json({ error: "No records found." });

  const { rentedOn: start } = rental;
  const end = Date.now();

  const { dailyRentalRate: rate } = movie;

  // Calculate the rental duration in seconds
  const durationInSeconds = (end - start) / 1000;

  // Calculate the rental fee
  const amtPayable = durationInSeconds * rate;

  rental.returnedOn = end;
  rental.rentalFee = amtPayable;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await rental.save();

    // Update user's currentRentals array
    const updatedCurRentals = curRentalArray.filter(
      (arr) => arr.movie.toString() !== req.params.id
    );
    user.currentRentals = updatedCurRentals;

    // Add rental ID to rentalHistory
    user.rentalHistory.push(rental._id);

    await user.save();

    movie.numberInStock++;
    await movie.save();

    res.status(200).send("Returned is successfull...");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error("error while returning movie ", error.message);
    res.status(400).send(error.message);
  }
});

module.exports = router;
