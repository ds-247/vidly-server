const logger = require("../startup/logger");
const auth = require("../middleware/auth");
const { Rental } = require("../models/rental");
const { User, validateUserId } = require("../models/user");
const { Movie, validateMovieId } = require("../models/movie");
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const _ = require("lodash");

router.get("/prevRentals", [auth], async (req, res) => {
  const userId = req.user._id;

  const ex = await validateUserId(userId);
  if (ex) return res.status(400).send("Invalid User Id");

  const user = await User.findById(userId);
  if (!user) return res.status(404).send("User not found ...");

  const prevRentalArray = user.rentalHistory;
  const rentalIdArray = prevRentalArray.map((obj) => obj._id);

  const rentals = await Rental.find({ _id: { $in: rentalIdArray } });
  res.send(rentals);
});

router.get("/currentRentals", [auth], async (req, res) => {
  const userId = req.user._id;

  const ex = await validateUserId(userId);
  if (ex) return res.status(400).send(ex.details[0].message);

  const user = await User.findById(userId);
  if (!user) return res.status(404).send("User not found...");

  const curRentalArray = user.currentRentals;
  const rentalIdArray = curRentalArray.map((obj) => obj.rentalId);

  const rentals = await Rental.find({ _id: { $in: rentalIdArray } });
  res.send(rentals);
});

// Rent a movie
router.put("/rent/:id", [auth], async (req, res) => {
  const movieId = req.params.id;

  const error = await validateMovieId(movieId);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(404).send("Movie does not exist.");

  const userId = req.user._id; // Inside the model, add user _id property while creating jwt

  const ex = await validateUserId(userId);
  if (ex) return res.status(400).send(ex.details[0].message);

  const user = await User.findById(userId);
  if (!user) return res.status(404).send("User not Found...");

  const { numberInStock } = movie;
  if (numberInStock === 0) return res.send("Out of Stock...");

  // Filter the array to check if the movie is already rented
  const curRentalArray = user.currentRentals;

  const alreadyRented = curRentalArray.find(
    (arr) => arr.movieId.toString() === movieId
  );

  if (alreadyRented) return res.status(400).send("Movie is already rented...");

  const newRental = new Rental({
    userId: userId,
    movieId: movieId,
    movieTitle: movie.title,
    rentedOn: new Date().toISOString().substring(0, 10),
    rate: movie.dailyRentalRate,
  });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await newRental.save();

    movie.numberInStock--;
    await movie.save();

    user.currentRentals.push({
      movieId: movieId,
      rentalId: newRental._id,
    });

    await user.save();

    res.status(200).send("Rented Successfully");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    logger.error("error while renting movie ", error.message);
    res.status(400).send(error.message);
  }
});

// instead of searching movie from database search from the currentrentals

// Return a movie
router.put("/return/:id", [auth], async (req, res) => {
  const movieId = req.params.id;

  const error = await validateMovieId(movieId);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(404).send("Movie does not exists.");

  const userId = req.user._id;

  let user = await User.findById(userId);
  if (!user) return res.status(404).send("User not found ...");

  // Filter the array to check if the movie is already rented
  const curRentalArray = user.currentRentals;

  const alreadyRented = curRentalArray.find(
    (arr) => arr.movieId.toString() === movieId
  );

  if (!alreadyRented) return res.status(400).send("Movie is not rented...");

  const rentalId = alreadyRented.rentalId;

  let rental = await Rental.findById(rentalId);
  if (!rental) return res.status(404).send("No records found.");

  const { rentedOn: start } = rental;
  const end = new Date().toISOString().substring(0, 10);

  const { dailyRentalRate: rate } = movie;

  // Calculate the rental duration in seconds
  let duration = calculateRentalDuration(start, end);
  duration = duration === 0 ? 1 : duration;

  // Calculate the rental fee
  const amtPayable = duration * rate;

  rental.returnedOn = end;
  rental.rentalFee = amtPayable;
  rental.duration = duration;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await rental.save();

    // Update user's currentRentals array
    const updatedCurRentals = curRentalArray.filter(
      (arr) => arr.movieId.toString() !== req.params.id
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

function calculateRentalDuration(rentedOn, returnedOn) {
  // Convert the date strings to Date objects
  const rentedDate = new Date(rentedOn);
  const returnedDate = new Date(returnedOn);

  // Calculate the time difference in milliseconds
  const timeDifference = returnedDate - rentedDate;

  // Calculate the number of days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}

function calculateRentalDuration(rentedOn, returnedOn) {
  // Convert the date strings to Date objects
  const rentedDate = new Date(rentedOn);
  const returnedDate = new Date(returnedOn);

  // Calculate the time difference in milliseconds
  const timeDifference = returnedDate - rentedDate;

  // Calculate the number of days
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return daysDifference;
}

module.exports = router;
