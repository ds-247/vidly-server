require("express-async-errors");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
const logger = require("./startup/logger");
const express = require("express");
const app = express();

require("./startup/routes")(app);
require("./startup/db")();

process.on("uncaughtException", (ex) => {
  console.log("We got an unCaught x ape sun...");
  logger.error(ex.message, ex);
});

process.on("unhandledRejection", (ex) => {
  console.log("We got an unCaught x ape sun...");
  logger.error(ex.message, ex);
});

if (!secretKey) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`server started at port ${PORT}`));
