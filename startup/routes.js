const express = require('express');
const error = require("../middleware/error");
const users = require("../Routes/users");
const auth = require("../Routes/auth");
const genres = require("../Routes/genres");
const movies = require("../Routes/movies");
const rentals = require("../Routes/rentals");
const customers = require("../Routes/customers");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/customers", customers);
  app.use(error);
};
