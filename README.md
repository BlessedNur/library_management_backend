# Library Management System - Backend

Simple backend API for library management system.

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Yup (validation)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_secret_key
```

3. Start server:

```bash
npm run dev
```

## API Endpoints

### Auth

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Books

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Loans

- `GET /api/loans` - Get all loans
- `POST /api/loans` - Create loan
- `PUT /api/loans/:id/return` - Return book

### Reservations

- `GET /api/reservations` - Get all reservations
- `POST /api/reservations` - Create reservation
- `PUT /api/reservations/:id/cancel` - Cancel reservation

### Fines

- `GET /api/fines` - Get all fines
- `POST /api/fines` - Create fine (Admin only)
- `PUT /api/fines/:id/pay` - Pay fine

## Usage

Include JWT token in Authorization header:

```
Authorization: Bearer <token>
```
