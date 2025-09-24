const yup = require("yup");

// Simple validation schemas
const userSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const bookSchema = yup.object({
  title: yup.string().required(),
  author: yup.string().required(),
  isbn: yup.string().required(),
  genre: yup.string().required(),
  totalCopies: yup.number().min(1).required(),
});

const loanSchema = yup.object({
  bookId: yup.string().required(),
  dueDate: yup.date().required(),
});

const reservationSchema = yup.object({
  bookId: yup.string().required(),
});

// Validation middleware
const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  validateUser: validate(userSchema),
  validateBook: validate(bookSchema),
  validateLoan: validate(loanSchema),
  validateReservation: validate(reservationSchema),
};
