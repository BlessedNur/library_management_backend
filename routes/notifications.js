const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/auth");

// Test email system
router.get("/test", notificationController.testEmailSystem);

// Send return reminders
router.post(
  "/return-reminders",
  auth,
  notificationController.sendReturnReminders
);

// Send overdue notifications
router.post(
  "/overdue-notifications",
  auth,
  notificationController.sendOverdueNotifications
);

module.exports = router;
