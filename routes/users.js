const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/auth");

// Get all users (admin only)
router.get("/", protect, adminOnly, getUsers);

module.exports = router;
