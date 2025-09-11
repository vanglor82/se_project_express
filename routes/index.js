const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NotFoundError } = require("../utils/errors");
const { loginUser, createUser } = require("../controllers/users");
const { validateLogin, validateUser } = require("../middlewares/validation");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.post("/signin", validateLogin, loginUser);
router.post("/signup", validateUser, createUser);

router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
