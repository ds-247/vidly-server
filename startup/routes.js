const express = require("express");
const error = require("../middleware/error");
const users = require("../Routes/users");
const auth = require("../Routes/auth");
const genres = require("../Routes/genres");
const movies = require("../Routes/movies");
const rentals = require("../Routes/rentals");
// const customers = require("../Routes/customers");
const clientGenres = require("../Routes/clientGenres");
const clientMovies = require("../Routes/clientMovies");
const clientUsers = require("../Routes/clientUsers");
const clientRentals = require("../Routes/clientRentals");

module.exports = function (app) {
  app.use(express.json({ limit: "5mb" }));
  app.use("/api/admin/users", users);
  app.use("/api/admin/auth", auth);
  app.use("/api/admin/genres", genres);
  app.use("/api/admin/movies", movies);
  app.use("/api/admin/rentals", rentals);
  // app.use("/api/admin/customers", customers);
  app.use("/api/client/genres", clientGenres);
  app.use("/api/client/movies", clientMovies);
  app.use("/api/client/users", clientUsers);
  app.use("/api/client/rentals", clientRentals);
  app.use("/api/client/auth", auth);
  app.use(error);
};
