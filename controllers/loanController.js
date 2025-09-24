const Loan = require("../models/Loan");
const Book = require("../models/Book");

const getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate("user", "name email")
      .populate("book", "title author");
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createLoan = async (req, res) => {
  try {
    const { bookId, dueDate } = req.body;

    // Debug: Check if user is properly authenticated
    console.log("User from req.user:", req.user);

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    const loan = await Loan.create({
      user: req.user._id, // Use _id instead of id
      book: bookId,
      dueDate: new Date(dueDate),
    });

    // Update book copies
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { availableCopies: -1 } },
      { new: true } // Return the updated document
    );

    console.log("Book availability updated:", {
      bookId,
      availableCopies: updatedBook.availableCopies,
      totalCopies: updatedBook.totalCopies,
    });

    res.status(201).json({
      loan,
      book: updatedBook,
    });
  } catch (error) {
    console.error("Loan creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const returnBook = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loan.status = "returned";
    loan.returnedDate = new Date();
    await loan.save();

    // Update book copies
    const updatedBook = await Book.findByIdAndUpdate(
      loan.book,
      { $inc: { availableCopies: 1 } },
      { new: true } // Return the updated document
    );

    console.log("Book returned, availability updated:", {
      bookId: loan.book,
      availableCopies: updatedBook.availableCopies,
      totalCopies: updatedBook.totalCopies,
    });

    res.json({
      loan,
      book: updatedBook,
    });
  } catch (error) {
    console.error("Return book error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getLoans,
  createLoan,
  returnBook,
};
