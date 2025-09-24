const express = require("express");
const { protect, adminOnly } = require("../middleware/auth");
const { validateBook } = require("../middleware/validation");
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

const router = express.Router();

router.get("/", getBooks);
router.get("/:id", getBook);
router.post("/", protect, adminOnly, validateBook, createBook);
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

module.exports = router;
