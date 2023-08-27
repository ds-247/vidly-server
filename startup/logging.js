require("express-async-errors");
const logger = require("./logger");

module.exports = function(){
  // Handle uncaught exceptions
  process.on("uncaughtException", (ex) => {
    // console.log("We got an unCaught x ape sun...");
    logger.error(ex.message, ex);
  });

  // Handle unhandled rejections
  process.on("unhandledRejection", (ex) => {
    // console.log("We got an unCaught x ape sun...");
    logger.error(ex.message, ex);
  });
}

