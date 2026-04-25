const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtp, updatePassword } = require("../controllers/forgot");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.put("/update-password", updatePassword);

module.exports = router;