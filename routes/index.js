const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");
const { loginUser, createUser } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.post("/signin", loginUser);
router.post("/signup", createUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
