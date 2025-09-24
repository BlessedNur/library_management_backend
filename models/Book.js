const mongoose = require("mongoose");

// Function to generate a unique 13-digit ISBN
const generateISBN = async () => {
  let isbn;
  let isUnique = false;

  while (!isUnique) {
    // Generate a 13-digit number starting with 978 or 979 (common ISBN prefixes)
    const prefix = Math.random() > 0.5 ? "978" : "979";
    const randomDigits = Math.floor(Math.random() * 1000000000000)
      .toString()
      .padStart(10, "0");
    isbn = prefix + randomDigits;

    // Check if this ISBN already exists
    const existingBook = await mongoose
      .model("Book", bookSchema)
      .findOne({ isbn });
    if (!existingBook) {
      isUnique = true;
    }
  }

  return isbn;
};

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values but ensures uniqueness for non-null values
    },
    genre: {
      type: String,
      required: true,
    },
    description: String,
    totalCopies: {
      type: Number,
      default: 1,
    },
    availableCopies: {
      type: Number,
      default: 1,
    },
    coverImage: String,
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to auto-generate ISBN if not provided
bookSchema.pre("save", async function (next) {
  if (!this.isbn) {
    try {
      this.isbn = await generateISBN();
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("Book", bookSchema);
