const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    borrowedDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnedDate: Date,
    status: {
      type: String,
      default: "active",
      enum: ["active", "returned", "overdue"],
    },
  },
  
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Loan", loanSchema);
