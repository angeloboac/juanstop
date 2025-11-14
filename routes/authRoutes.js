const express = require("express");
const router = express.Router();
const { loginUser, verifyOTP, resendOTP, forgotPassword, verifyForgotOTP, resendForgotOTP, resetPassword } = require("../controllers/authController");

router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP); 
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-otp", verifyForgotOTP);
router.post("/reset-password", resetPassword);
router.post("/resend-forgot-otp", resendForgotOTP);
module.exports = router;