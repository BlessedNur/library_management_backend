const express = require("express");
const { protect, adminOnly } = require("../middleware/auth");
const {
  getFines,
  createFine,
  payFine,
} = require("../controllers/fineController");

const router = express.Router();

router.get("/", protect, getFines);
router.post("/", protect, adminOnly, createFine);
router.put("/:id/pay", protect, payFine);

module.exports = router;
