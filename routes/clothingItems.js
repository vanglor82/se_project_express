const router = require("express").Router();
const { createItem, getItems, updateItem, deleteItem, likeItem, dislikeItem } = require("../controllers/clothingItems");

router.post("/", createItem);

router.get("/", getItems);

router.put("/", updateItem);

router.delete("/", deleteItem);

router.put("/", likeItem);

router.delete("/", dislikeItem);

module.exports = router;
