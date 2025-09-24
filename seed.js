const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, ".env") });

// Import models
const User = require("./models/User");
const Book = require("./models/Book");
const Loan = require("./models/Loan");
const Fine = require("./models/Fine");

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://blessednur67:HOODQUAN67@cluster0.wftw5hq.mongodb.net/library_management?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Book.deleteMany({});
    await Loan.deleteMany({});
    await Fine.deleteMany({});
    console.log("Cleared existing data");

    // Create users
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@library.com",
      password: "admin123",
      role: "admin",
    });

    const regularUser1 = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      role: "user",
    });

    const regularUser2 = await User.create({
      name: "Jane Smith",
      email: "jane@example.com",
      password: "password123",
      role: "user",
    });

    const regularUser3 = await User.create({
      name: "Bob Johnson",
      email: "bob@example.com",
      password: "password123",
      role: "user",
    });

    console.log("Created users");

    // Create books (ISBN will be auto-generated)
    const booksData = [
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        description: "A classic American novel set in the Jazz Age",
        totalCopies: 3,
        availableCopies: 2,
        coverImage:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        description:
          "A gripping tale of racial injustice and childhood innocence",
        totalCopies: 2,
        availableCopies: 1,
        coverImage:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      },
      {
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian Fiction",
        description: "A dystopian social science fiction novel",
        totalCopies: 2,
        availableCopies: 0,
        coverImage:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      },
      {
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Romance",
        description: "A romantic novel of manners",
        totalCopies: 1,
        availableCopies: 1,
        coverImage:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      },
      {
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        description: "A fantasy novel about a hobbit's unexpected journey",
        totalCopies: 2,
        availableCopies: 1,
        coverImage:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        author: "J.K. Rowling",
        genre: "Fantasy",
        description: "The first book in the Harry Potter series",
        totalCopies: 4,
        availableCopies: 3,
        coverImage:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      },
      {
        title: "The Catcher in the Rye",
        author: "J.D. Salinger",
        genre: "Fiction",
        description: "A coming-of-age story about teenage rebellion",
        totalCopies: 2,
        availableCopies: 2,
        coverImage:
          "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      },
      {
        title: "Lord of the Rings",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        description: "An epic fantasy trilogy",
        totalCopies: 3,
        availableCopies: 2,
        coverImage:
          "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      },
    ];

    // Create books one by one to trigger auto-generation
    const books = [];
    for (const bookData of booksData) {
      const book = await Book.create(bookData);
      books.push(book);
    }

    console.log("Created books");

    // Create loans with different statuses
    const loans = await Loan.insertMany([
      {
        user: regularUser1._id,
        book: books[0]._id, // The Great Gatsby
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: "active",
      },
      {
        user: regularUser2._id,
        book: books[1]._id, // To Kill a Mockingbird
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days overdue
        status: "overdue",
      },
      {
        user: regularUser3._id,
        book: books[2]._id, // 1984
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        status: "active",
      },
      {
        user: regularUser1._id,
        book: books[4]._id, // The Hobbit
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days overdue
        status: "overdue",
      },
      {
        user: regularUser2._id,
        book: books[6]._id, // The Catcher in the Rye
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        status: "active",
      },
    ]);

    console.log("Created loans");

    // Create fines for overdue books
    const fines = await Fine.insertMany([
      {
        user: regularUser2._id,
        loan: loans[1]._id,
        amount: 10.0,
        reason: "Late return - To Kill a Mockingbird",
        status: "pending",
      },
      {
        user: regularUser1._id,
        loan: loans[3]._id,
        amount: 15.0,
        reason: "Late return - The Hobbit",
        status: "pending",
      },
      {
        user: regularUser3._id,
        loan: loans[2]._id,
        amount: 5.0,
        reason: "Damaged book cover",
        status: "paid",
      },
    ]);

    console.log("Created fines");

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📋 Sample Users:");
    console.log("Admin: admin@library.com / admin123");
    console.log("User 1: john@example.com / password123");
    console.log("User 2: jane@example.com / password123");
    console.log("User 3: bob@example.com / password123");
    console.log("\n📚 Features to test:");
    console.log("• 8 books with different availability");
    console.log("• 5 active/overdue loans");
    console.log("• 3 fines (2 pending, 1 paid)");
    console.log("• Admin can manage all books and users");
    console.log("• Users can borrow/return books");
    console.log("• Fine system with pay functionality");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
};

// Run the seed function
seedDatabase();
