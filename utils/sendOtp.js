const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "juanstop69@gmail.com", // Gmail
    pass: "crlqpddvxnwrazaz", // App Password
  },
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000, // Set timeout to 10 seconds
  greetingTimeout: 5000, // Set greeting timeout to 5 seconds
  sendTimeout: 10000,
});

const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: '"Juan Stop" <juanstop69@gmail.com>',
    to,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. Please do not share this with anyone. It expires in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
  }
};

module.exports = sendOTPEmail;
