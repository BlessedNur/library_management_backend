const Loan = require('../models/Loan');
const User = require('../models/User');
const Book = require('../models/Book');
const emailService = require('./emailService');

// Calculate days between two dates
const calculateDaysDifference = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.round((date2 - date1) / oneDay);
};

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const notificationService = {
  // Send return reminders (3 days before due date)
  sendReturnReminders: async () => {
    try {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

      // Find loans due in 3 days
      const loans = await Loan.find({
        status: 'active',
        dueDate: {
          $gte: new Date(threeDaysFromNow.getTime() - 24 * 60 * 60 * 1000), // Start of day
          $lt: new Date(threeDaysFromNow.getTime() + 24 * 60 * 60 * 1000), // End of day
        },
      })
        .populate('user', 'name email')
        .populate('book', 'title');

      console.log(`Found ${loans.length} loans due in 3 days`);

      for (const loan of loans) {
        const returnDate = formatDate(loan.dueDate);
        await emailService.sendReturnReminder(
          loan.user.email,
          loan.user.name,
          loan.book.title,
          returnDate
        );
      }

      return { success: true, count: loans.length };
    } catch (error) {
      console.error('Error sending return reminders:', error);
      return { success: false, error: error.message };
    }
  },

  // Send overdue notifications
  sendOverdueNotifications: async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Find overdue loans
      const loans = await Loan.find({
        status: 'active',
        dueDate: { $lt: today },
      })
        .populate('user', 'name email')
        .populate('book', 'title');

      console.log(`Found ${loans.length} overdue loans`);

      for (const loan of loans) {
        const daysOverdue = calculateDaysDifference(loan.dueDate, today);
        const fineAmount = Math.max(0, daysOverdue * 1.0); // $1 per day overdue

        await emailService.sendOverdueNotification(
          loan.user.email,
          loan.user.name,
          loan.book.title,
          daysOverdue,
          fineAmount.toFixed(2)
        );

        // Update fine in the loan record
        loan.fineAmount = fineAmount;
        await loan.save();
      }

      return { success: true, count: loans.length };
    } catch (error) {
      console.error('Error sending overdue notifications:', error);
      return { success: false, error: error.message };
    }
  },

  // Send reservation available notifications
  sendReservationAvailableNotifications: async () => {
    try {
      // This would be called when a book is returned and has reservations
      // For now, we'll create a placeholder function
      console.log('Reservation notifications would be sent here');
      return { success: true, count: 0 };
    } catch (error) {
      console.error('Error sending reservation notifications:', error);
      return { success: false, error: error.message };
    }
  },

  // Send welcome email to new user
  sendWelcomeEmail: async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      await emailService.sendWelcomeEmail(user.email, user.name);
      return { success: true };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  },

  // Daily notification job
  runDailyNotifications: async () => {
    console.log('Running daily notifications...');
    
    const results = {
      returnReminders: await notificationService.sendReturnReminders(),
      overdueNotifications: await notificationService.sendOverdueNotifications(),
      reservationNotifications: await notificationService.sendReservationAvailableNotifications(),
    };

    console.log('Daily notifications completed:', results);
    return results;
  },

  // Test email functionality
  testEmailSystem: async () => {
    try {
      const testResult = await emailService.testEmailConfig();
      return { success: testResult, message: testResult ? 'Email system is working' : 'Email system has issues' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
};

module.exports = notificationService;
