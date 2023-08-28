require("dotenv").config();

const logger = require("./startup/logger");
const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors()); // for cross origin requests

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => logger.info(`server started at port ${PORT}`));