const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    const error = new Error("Authorization required: Missing or invalid token format.");
    error.statusCode = UNAUTHORIZED;
    return next(error);
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    const error = new Error("Authorization required: Invalid token.");
    error.statusCode = UNAUTHORIZED;
    return next(error);
  }
  req.user = payload;
  return next();
};

module.exports = auth;
