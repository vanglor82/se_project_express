const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

function generateToken(user, extraPayload = {}, options = {}) {
  const basePayload = {
    _id: user._id,
    email: user.email,
    role: user.role || "user",
  };

  const payload = { ...basePayload, ...extraPayload };
  const tokenOptions = { expiresIn: "7d", ...options };

  const token = jwt.sign(payload, JWT_SECRET, tokenOptions);

  if (process.env.NODE_ENV === "development") {
    console.log("[Token Issued]", payload);
  }

  return token;
}

module.exports = generateToken;
