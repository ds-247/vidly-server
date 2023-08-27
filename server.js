require("dotenv").config();

const logger = require("./startup/logger");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`server started at port ${PORT}`));