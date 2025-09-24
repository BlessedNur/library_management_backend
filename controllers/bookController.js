const Book = require("../models/Book");

// Function to generate a unique 13-digit ISBN
const generateISBN = async () => {
  let isbn;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate a 13-digit number starting with 978 or 979 (common ISBN prefixes)
    const prefix = Math.random() > 0.5 ? "978" : "979";
    const randomDigits = Math.floor(Math.random() * 1000000000000).toString().padStart(10, '0');
    isbn = prefix + randomDigits;
    
    // Check if this ISBN already exists
    const existingBook = await Book.findOne({ isbn });
    if (!existingBook) {
      isUnique = true;
    }
  }
  
  return isbn;
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createBook = async (req, res) => {
  try {
    // Generate unique ISBN automatically
    const isbn = await generateISBN();
    
    // Remove ISBN from request body if provided (we auto-generate it)
    const { isbn: _, ...bookData } = req.body;
    
    // Create book with auto-generated ISBN
    const book = await Book.create({
      ...bookData,
      isbn: isbn
    });
    
    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBook = async (req, res) => {
  try {
    // Remove ISBN from update data (ISBN should not be changeable)
    const { isbn: _, ...updateData } = req.body;
    
    const book = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
};
