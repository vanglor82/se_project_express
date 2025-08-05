const mongoose = require("mongoose");

const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  if (!req.user || !req.user.id) {
    const error = new Error("Authorization required");
    error.statusCode = UNAUTHORIZED;
    return next(error);
  }

  const { name, weather, imageUrl } = req.body;
  const owner = req.user.id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).json(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        const error = new Error("Invalid data");
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      return next(err);
    });
};


const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    const error = new Error("Invalid item ID format");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        const error = new Error("Item not found");
        error.statusCode = NOT_FOUND;
        return next(error);
      }

      if (item.owner.toString() !== req.user.id.toString()) {
        const error = new Error("You can only delete your own items");
        error.statusCode = FORBIDDEN;
        return next(error);
      }

      return ClothingItem.findByIdAndDelete(itemId)
        .then((deletedItem) => res.status(200).send({ data: deletedItem }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const error = new Error("Invalid item ID format");
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    const error = new Error("Invalid item ID format");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user.id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        const error = new Error("Item not found");
        error.statusCode = NOT_FOUND;
        return next(error);
      }

      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const error = new Error("Invalid item ID format");
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    const error = new Error("Invalid item ID format");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user.id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        const error = new Error("Item not found");
        error.statusCode = NOT_FOUND;
        return next(error);
      }

      return res.status(200).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const error = new Error("Invalid item ID format");
        error.statusCode = BAD_REQUEST;
        return next(error);
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};