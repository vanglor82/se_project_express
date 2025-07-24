const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log('[createItem:req.user]', req.user);

  const { name, weather, imageUrl } = req.body;

  if (!req.user || !req.user._id) {
  console.log('[createItem] req.user is missing or malformed');
  return res.status(401).send({ message: 'User authentication required' });
}

  return clothingItem
  .create({ name, weather, imageUrl, owner: req.user._id })
  .then((item) => {
    res.status(201).send({ data: item.toObject() });
  })
  .catch((err) => {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(BAD_REQUEST).send({ message: err.message });
    }

    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An error has occurred on the server." });
  });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const itemId = req.params.id;
  const currentUserId = req.user._id;

  clothingItem
    .findById(itemId)
    .orFail(() => {
      throw new Error("Item not found");
    })
    .then((item) => {
      if (item.owner.toString() !== currentUserId) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You don't have permission to delete this item" });
      }

      return clothingItem.findByIdAndDelete(itemId);
    })
    .then(() => {
      res.send({ message: "Item successfully deleted" });
    })
    .catch((err) => {
      console.error("[Delete Item Error]", err);

      if (err.name === "CastError") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Invalid item ID format" });
      }

      if (err.message === "Item not found") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "Server error while deleting item" });
    });
};

const likeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      throw new Error("Item not found");
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid item ID format" });
      }
      if (err.message === "Item not found") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server." });
    });
};

const dislikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail(() => {
      throw new Error("Item not found");
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid item ID format" });
      }
      if (err.message === "Item not found") {
        return res.status(NOT_FOUND).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server." });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
