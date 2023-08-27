const secretKey = process.env.SECRET_KEY;

module.exports = function () {
  if (!secretKey) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
  }
};
