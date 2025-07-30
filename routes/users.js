const router = require("express").Router();
const {
  getUser,
  updateProfile,
  createUser,
  loginUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getUser);
router.patch("/me", auth, updateProfile);
router.post("/signup", auth, createUser);
router.post("/signin", auth, loginUser);

module.exports = router;
