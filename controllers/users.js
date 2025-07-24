const bcrypt = require("bcrypt");
const User = require("../models/user");
const generateToken = require("../utils/generateToken");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error("[Get Users Error]", err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Server error occurred." });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }

      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const token = generateToken(user);

      const userObj = {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      };

      return res.status(201).json({ token, user: userObj });
    })
    .catch((err) => {
      console.error("[Create User Error]", err);

      if (err.name === "ValidationError") {
        return res.status(400).json({ message: "Invalid data input." });
      }

      if (err.code === 11000) {
        return res.status(409).json({ message: "Email already exists" });
      }

      return res.status(500).json({ message: "Server error." });
    });
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new Error("User not found");
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error("[Get Current User Error]", err);

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }

      if (err.message === "User not found") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Server error." });
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateToken(user);
      return res.status(200).send({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
    })
    .catch((err) => {
      console.error("[Login User Error]", err);
      return res.status(BAD_REQUEST).send({
        message: "Incorrect email or password",
      });
    });
};

const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new Error("User not found");
    })
    .then((updatedUser) => res.status(200).send(updatedUser))
    .catch((err) => {
      console.error("[Update User Error]", err);

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data input." });
      }

      if (err.message === "User not found") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Server error." });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  loginUser,
  updateUserProfile,
};
