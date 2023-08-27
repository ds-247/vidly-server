const logger = require("./logger");
const mongoose = require("mongoose");

module.exports = function () {
  connectDB()
    .then(() => logger.info("Connected to DB Successfully...."))
    .catch((err) => logger.error(err.message, err));
};

async function connectDB() {
  await mongoose.connect("mongodb://127.0.0.1:27017/VIDLY");
}
