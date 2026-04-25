const User = require("../models/User");
const { asyncWrap } = require("../utils/asyncWrap");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const generateUsernameSuggestions = require("../utils/generateUsername");
module.exports.Signup = asyncWrap(async (req, res) => {

    const { name, email, password } = req.body;

    const suggestions = await generateUsernameSuggestions(name);
    console.log(suggestions)
    const username = suggestions[0];
    const userExist = await User.findOne({
        $or: [
            { username },
            { email }

        ]
    })

    if (userExist) {
        return res.status(400).json({ message: "User Already Exist!", success: false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, username, email, password: hashPassword });
    const savedUser = await newUser.save();

    const token = jwt.sign(
        { id: savedUser._id },
        process.env.ACCESS_SECRET,
        { expiresIn: "7d" }
    );



    const { password: pass, ...userData } = savedUser._doc;

    res.status(200).json({
        success: true,
        message: "Signup Successfully",
        user: userData,
        accessToken: token,
    })
})

module.exports.Login = asyncWrap(async (req, res) => {

    let { identifier, password } = req.body;



    if (!password) {
        return res.status(400).json({
            message: "Password required",
            success: false
        });
    }

    identifier = identifier.trim();
    password = password.trim();


    if (!identifier || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false
        });
    }


    const query = identifier.includes("@")
        ? { email: identifier }
        : { username: identifier };


    const user = await User.findOne(query);

    if (!user) {
        return res.status(400).json({
            message: "Invalid credentials",
            success: false
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid credentials",
            success: false
        });
    }

    const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
        message: "Login Successfully",
        success: true,
        accessToken,
        user: userData
    });

});


// refresh token

module.exports.refreshToken = async (req, res) => {

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token" });
    }

    try {

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET
        );

        const accessToken = jwt.sign(
            { id: decoded.id },
            process.env.ACCESS_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken });

    } catch (e) {

        res.status(401).json({
            message: "Invalid refresh token"
        });

    }
};



module.exports.Logout = asyncWrap(async (req, res) => {


    res.clearCookie("refreshToken", {

        httpOnly: true,
        secure: true,
        sameSite: "lax"
    })

    res.status(200).json({ message: "Logout Successfully", success: true });

})