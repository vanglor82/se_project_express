const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
  NOT_FOUND,
} = require("../utils/errors");

const getUser = (req, res, next) => {
  if (!req.user || !req.user.id) {
    const error = new Error("Authorization required");
    error.statusCode = UNAUTHORIZED;
    return next(error);
  }

  return User.findById(req.user.id)
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = NOT_FOUND;
        return next(error);
      }

      return res.status(200).json({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const error = new Error("Invalid data");
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, password, email } = req.body;

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const error = new Error("Email already exists");
        error.statusCode = CONFLICT;
        return next(error);
      }
      return bcrypt.hash(password, 10).then((hash) =>
        User.create({ name, avatar, email, password: hash }).then((user) =>
          res.status(200).json({
            id: user.id,
            name: user.name,
            avatar: user.avatar,
            email: user.email,
          })
        )
      );
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const error = new Error("Invalid data");
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      return next(err);
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        const error = new Error("Invalid email or password");
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user.id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.statusCode = NOT_FOUND;
        return next(error);
      }

      const updatedUser = {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };
      return res.status(200).json(updatedUser);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const error = new Error("Invalid data");
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      return next(err);
    });
};

module.exports = {
  getUser,
  createUser,
  loginUser,
  updateProfile,
};
