const express = require("express");
const { protect } = require("../middleware/auth");
const {
  getReservations,
  createReservation,
  cancelReservation,
} = require("../controllers/reservationController");

const router = express.Router();

router.get("/", protect, getReservations);
router.post("/", protect, createReservation);
router.put("/:id/cancel", protect, cancelReservation);

module.exports = router;
