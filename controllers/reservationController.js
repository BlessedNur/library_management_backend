const Reservation = require("../models/Reservation");
const Book = require("../models/Book");

const getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email")
      .populate("book", "title author");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createReservation = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.availableCopies > 0) {
      return res.status(400).json({ message: "Book is available" });
    }

    const reservation = await Reservation.create({
      user: req.user.id,
      book: bookId,
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    reservation.status = "cancelled";
    await reservation.save();

    res.json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getReservations,
  createReservation,
  cancelReservation,
};
