const express = require("express");
const { protect } = require("../middleware/auth");
const { validateUser } = require("../middleware/validation");
const { register, login, getMe } = require("../controllers/authController");

const router = express.Router();

router.post("/register", validateUser, register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
