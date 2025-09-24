const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransporter({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const emailTemplates = {
  returnReminder: (userName, bookTitle, returnDate) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">📚 Library Return Reminder</h2>
      <p>Dear ${userName},</p>
      <p>This is a friendly reminder that your borrowed book <strong>"${bookTitle}"</strong> is due for return on <strong>${returnDate}</strong>.</p>
      <p>Please return the book on time to avoid any late fees.</p>
      <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Book Details:</h3>
        <p><strong>Title:</strong> ${bookTitle}</p>
        <p><strong>Due Date:</strong> ${returnDate}</p>
      </div>
      <p>Thank you for using our library system!</p>
      <hr style="margin: 30px 0;">
      <p style="color: #6b7280; font-size: 12px;">This is an automated message from the Library Management System.</p>
    </div>
  `,

  overdueBook: (userName, bookTitle, daysOverdue, fineAmount) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #dc2626;">⚠️ Overdue Book Notice</h2>
      <p>Dear ${userName},</p>
      <p>Your borrowed book <strong>"${bookTitle}"</strong> is overdue by <strong>${daysOverdue} days</strong>.</p>
      <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #dc2626;">Overdue Details:</h3>
        <p><strong>Book Title:</strong> ${bookTitle}</p>
        <p><strong>Days Overdue:</strong> ${daysOverdue} days</p>
        <p><strong>Fine Amount:</strong> $${fineAmount}</p>
      </div>
      <p>Please return the book as soon as possible to avoid additional fines.</p>
      <p>Thank you for your cooperation.</p>
      <hr style="margin: 30px 0;">
      <p style="color: #6b7280; font-size: 12px;">This is an automated message from the Library Management System.</p>
    </div>
  `,

  reservationAvailable: (userName, bookTitle) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #059669;">📖 Reserved Book Available</h2>
      <p>Dear ${userName},</p>
      <p>Great news! The book you reserved <strong>"${bookTitle}"</strong> is now available for pickup.</p>
      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #059669;">Reservation Details:</h3>
        <p><strong>Book Title:</strong> ${bookTitle}</p>
        <p><strong>Status:</strong> Ready for pickup</p>
      </div>
      <p>Please visit the library to collect your reserved book. You have 3 days to pick it up before the reservation expires.</p>
      <p>Thank you for using our library system!</p>
      <hr style="margin: 30px 0;">
      <p style="color: #6b7280; font-size: 12px;">This is an automated message from the Library Management System.</p>
    </div>
  `,

  welcome: (userName) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">🎉 Welcome to Our Library!</h2>
      <p>Dear ${userName},</p>
      <p>Welcome to our Library Management System! Your account has been successfully created.</p>
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">What you can do:</h3>
        <ul>
          <li>Browse and search our book catalog</li>
          <li>Borrow books (up to 5 books at a time)</li>
          <li>Reserve books that are currently on loan</li>
          <li>View your borrowing history</li>
          <li>Manage your account settings</li>
        </ul>
      </div>
      <p>We hope you enjoy using our library system!</p>
      <p>Best regards,<br>The Library Team</p>
      <hr style="margin: 30px 0;">
      <p style="color: #6b7280; font-size: 12px;">This is an automated message from the Library Management System.</p>
    </div>
  `,
};

const emailService = {
  sendReturnReminder: async (userEmail, userName, bookTitle, returnDate) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `📚 Return Reminder: ${bookTitle}`,
        html: emailTemplates.returnReminder(userName, bookTitle, returnDate),
      };

      await transporter.sendMail(mailOptions);
      console.log(`Return reminder sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error("Error sending return reminder:", error);
      return false;
    }
  },

  sendOverdueNotification: async (
    userEmail,
    userName,
    bookTitle,
    daysOverdue,
    fineAmount
  ) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `⚠️ Overdue Book: ${bookTitle}`,
        html: emailTemplates.overdueBook(
          userName,
          bookTitle,
          daysOverdue,
          fineAmount
        ),
      };

      await transporter.sendMail(mailOptions);
      console.log(`Overdue notification sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error("Error sending overdue notification:", error);
      return false;
    }
  },

  sendReservationAvailable: async (userEmail, userName, bookTitle) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: `📖 Reserved Book Available: ${bookTitle}`,
        html: emailTemplates.reservationAvailable(userName, bookTitle),
      };

      await transporter.sendMail(mailOptions);
      console.log(`Reservation available notification sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error("Error sending reservation notification:", error);
      return false;
    }
  },

  sendWelcomeEmail: async (userEmail, userName) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: "🎉 Welcome to Our Library!",
        html: emailTemplates.welcome(userName),
      };

      await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error("Error sending welcome email:", error);
      return false;
    }
  },

  testEmailConfig: async () => {
    try {
      await transporter.verify();
      console.log("Email configuration is valid");
      return true;
    } catch (error) {
      console.error("Email configuration error:", error);
      return false;
    }
  },
};

module.exports = emailService;
