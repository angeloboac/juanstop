const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "juanstop69@gmail.com",
    pass: "crlqpddvxnwrazaz", // NEW APP PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
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
