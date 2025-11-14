const User = require("../model/User");
const OTP = require("../model/OTP");
const sendOTPEmail = require("../utils/sendOtp");

// ------------------ LOGIN ------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Verify user by email only
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    //  Compare plain text password (no encryption)
    if (password !== user.password)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    //  Generate OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    //  Save or update OTP in DB
    const existing = await OTP.findOne({ userId: user._id });
    if (existing) {
      existing.otp = otpCode;
      existing.createdAt = new Date();
      await existing.save();
    } else {
      await OTP.create({ userId: user._id, otp: otpCode });
    }

    //  Send OTP to email
    await sendOTPEmail(email, otpCode);

    res.json({
      success: true,
      requireOTP: true,
      message: "OTP sent to your email.",
      user: { id: user._id, role: user.role, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------ VERIFY LOGIN OTP ------------------
const verifyOTP = async (req, res) => {
  try {
    console.log(req.body);
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found." });

    const record = await OTP.findOne({ userId: user._id });
    if (!record) return res.status(400).json({ success: false, message: "OTP not found." });

    // Check expiry (5 minutes)
    const now = new Date();
    const otpAge = (now - record.createdAt) / 1000;
    if (otpAge > 300) {
      await record.deleteOne();
      return res.status(400).json({ success: false, message: "OTP expired. Please login again." });
    }

    if (record.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP." });

    await record.deleteOne();
    res.json({ success: true, message: "OTP verified successfully.", user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ------------------ RESEND LOGIN OTP ------------------
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, message: "User not found." });

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    const existing = await OTP.findOne({ userId: user._id });
    if (existing) {
      existing.otp = otpCode;
      existing.createdAt = new Date();
      await existing.save();
    } else {
      await OTP.create({ userId: user._id, otp: otpCode });
    }

    await sendOTPEmail(email, otpCode);
    res.json({ success: true, message: "OTP resent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ------------------ FORGOT PASSWORD: SEND OTP ------------------
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "Email not found." });

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

    await OTP.findOneAndUpdate(
      { userId: user._id },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otpCode);

    res.json({ success: true, message: "OTP sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

// ------------------ VERIFY FORGOT PASSWORD OTP ------------------
const verifyForgotOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const record = await OTP.findOne({ userId: user._id });
    if (!record) return res.status(400).json({ success: false, message: "OTP not found." });

    if ((new Date() - record.createdAt) / 1000 > 300) {
      await record.deleteOne();
      return res.status(400).json({ success: false, message: "OTP expired." });
    }

    if (record.otp !== otp)
      return res.status(400).json({ success: false, message: "Invalid OTP." });

    await record.deleteOne();
    res.json({ success: true, message: "OTP verified successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ------------------ RESET PASSWORD (PLAIN TEXT) ------------------
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!newPassword)
      return res.status(400).json({ success: false, message: "New password required." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    user.password = newPassword; // No hashing
    await user.save();

    res.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// ------------------ RESEND FORGOT PASSWORD OTP ------------------
const resendForgotOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found." });

    const record = await OTP.findOne({ userId: user._id });
    if (!record)
      return res.status(400).json({ success: false, message: "No OTP to resend. Please request again." });

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    record.otp = otpCode;
    record.createdAt = new Date();
    await record.save();

    await sendOTPEmail(email, otpCode);
    res.json({ success: true, message: "OTP resent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = {
  loginUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyForgotOTP,
  resendForgotOTP,
  resetPassword
};
