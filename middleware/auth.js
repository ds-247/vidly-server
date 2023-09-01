const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const authorisation = process.env.REQUIRES_AUTH;

module.exports = function (req, res, next) {
  if (authorisation === "false") return next();

  const token = req.header("x-auth-token");
  if (!token)
    return res.status(401).send("Access Denied. No token provided...");

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send("Invalid Token...");
  }
};
