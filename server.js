require("express-async-errors");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const logger = require("./logger");
const error = require("./middleware/error");
const users = require("./Routes/users");
const auth = require("./Routes/auth");
const genres = require("./Routes/genres");
const movies = require("./Routes/movies");
const rentals = require("./Routes/rentals");
const customers = require("./Routes/customers");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

process.on('uncaughtException',(ex)=>{
  console.log("We got an unCaught x ape sun...");
  logger.error(ex.message,ex);
});

process.on('unhandledRejection',(ex)=>{
  console.log("We got an unCaught x ape sun...");
  logger.error(ex.message,ex);
});


if (!secretKey) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

connectDB()
  .then(() => console.log("Connected to DB Successfully...."))
  .catch((err) => console.log(err));

async function connectDB() {
  await mongoose.connect("mongodb://127.0.0.1:27017/VIDLY");
}

app.use(express.json());
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/genres", genres);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/customers", customers);
app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`server started at port ${PORT}`));
