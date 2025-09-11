const router = require("express").Router();
const { getUser, updateProfile } = require("../controllers/users");

const { validateUserProfile } = require("../middlewares/validation");
const auth = require("../middlewares/auth");

router.get("/me", auth, getUser);
router.patch("/me", auth, validateUserProfile, updateProfile);

module.exports = router;
