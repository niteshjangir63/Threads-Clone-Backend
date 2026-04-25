const { asyncWrap } = require("../utils/asyncWrap");
const { generateOtp } = require("../utils/generateOtp")
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt")
const User = require("../models/User")
const sendMail = require("../controllers/email")

module.exports.sendOtp = asyncWrap(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ message: "email is required!" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found!" });

    const otp = generateOtp();
    console.log("OTP:", otp);

    const hashOtp = await bcrypt.hash(otp, 10);

    await Otp.findOneAndUpdate(
        { email },
        {
            otp: hashOtp,
            expireAt: new Date(Date.now() + 5 * 60 * 1000),
        },
        { upsert: true, new: true }
    );

    sendMail(email, "Your OTP Code", otp);

    res.json({ message: "OTP sent successfully!", success: true });
});



module.exports.verifyOtp = asyncWrap(async (req, res) => {


    let { email, otp } = req.body;




    if (!email || !otp) return res.status(401).json({ message: "Email or OTP required!" });

    const record = await Otp.findOne({ email });

    if (record.expireAt < new Date()) {
        await Otp.deleteMany({ email });
        return res.status(401).json({ message: "OTP expired!" })
    }

    const isMatch = await bcrypt.compare(otp, record.otp)

    if (!isMatch) return res.status(401).json({ message: "Incorrect Otp" })

    res.json({ message: "Verification Successfully!" })


})


module.exports.updatePassword = asyncWrap(async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)

    const user = await User.findOne({ email });

    if (!user) {
        return res.json({ message: "User not found" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;
    await user.save();

    return res.json({ message: "Password updated successfully!" });
});