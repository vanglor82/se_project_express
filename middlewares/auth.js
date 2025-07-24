const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  return jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: "Invalid or expired token" });
    }

    req.user = payload;
    return next();
  });
};
