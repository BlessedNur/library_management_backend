const emailService = require("../services/emailService");
const Loan = require("../models/Loan");
const User = require("../models/User");
const Book = require("../models/Book");

// Send return reminders
const sendReturnReminders = async (req, res) => {
  try {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const loans = await Loan.find({
      status: "active",
      dueDate: {
        $gte: new Date(threeDaysFromNow.getTime() - 24 * 60 * 60 * 1000),
        $lt: new Date(threeDaysFromNow.getTime() + 24 * 60 * 60 * 1000),
      },
    })
      .populate("user", "name email")
      .populate("book", "title");

    let sentCount = 0;
    for (const loan of loans) {
      const returnDate = new Date(loan.dueDate).toLocaleDateString();
      const success = await emailService.sendReturnReminder(
        loan.user.email,
        loan.user.name,
        loan.book.title,
        returnDate
      );
      if (success) sentCount++;
    }

    res.json({
      success: true,
      message: `Sent ${sentCount} return reminders`,
      count: sentCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send overdue notifications
const sendOverdueNotifications = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const loans = await Loan.find({
      status: "active",
      dueDate: { $lt: today },
    })
      .populate("user", "name email")
      .populate("book", "title");

    let sentCount = 0;
    for (const loan of loans) {
      const daysOverdue = Math.ceil(
        (today - loan.dueDate) / (1000 * 60 * 60 * 24)
      );
      const fineAmount = Math.max(0, daysOverdue * 1.0);

      const success = await emailService.sendOverdueNotification(
        loan.user.email,
        loan.user.name,
        loan.book.title,
        daysOverdue,
        fineAmount.toFixed(2)
      );
      if (success) sentCount++;

      // Update fine
      loan.fineAmount = fineAmount;
      await loan.save();
    }

    res.json({
      success: true,
      message: `Sent ${sentCount} overdue notifications`,
      count: sentCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Test email system
const testEmailSystem = async (req, res) => {
  try {
    const success = await emailService.testEmailConfig();
    res.json({
      success,
      message: success ? "Email system is working" : "Email system has issues",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  sendReturnReminders,
  sendOverdueNotifications,
  testEmailSystem,
};
