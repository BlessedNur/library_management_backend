const express = require("express");
const { protect } = require("../middleware/auth");
const { validateLoan } = require("../middleware/validation");
const {
  getLoans,
  createLoan,
  returnBook,
} = require("../controllers/loanController");

const router = express.Router();

router.get("/", protect, getLoans);
router.post("/", protect, validateLoan, createLoan);
router.put("/:id/return", protect, returnBook);

module.exports = router;
