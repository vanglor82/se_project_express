const router = require("express").Router();

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(500).send({ message:  "An error has occurred on the server." });
});

module.exports = router;
