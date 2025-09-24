const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { protect, adminOnly } = require("../middleware/auth");

// Test email system
router.get("/test", notificationController.testEmailSystem);

// Send return reminders
router.post(
  "/return-reminders",
  protect,
  adminOnly,
  notificationController.sendReturnReminders
);

// Send overdue notifications
router.post(
  "/overdue-notifications",
  protect,
  adminOnly,
  notificationController.sendOverdueNotifications
);

module.exports = router;
