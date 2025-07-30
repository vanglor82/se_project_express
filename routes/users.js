const router = require("express").Router();
const {
  getUser,
  updateProfile,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
