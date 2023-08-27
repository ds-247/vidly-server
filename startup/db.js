const logger = require("./logger");
const mongoose = require("mongoose");

const conncection_string = process.env.DB_CONNECTION_STRING;

module.exports = function () {
  connectDB()
    .then(() => logger.info("Connected to DB Successfully...."))
    .catch((err) => logger.error(err.message, err));
};

async function connectDB() {
  await mongoose.connect(conncection_string);
}
