const express = require("express");
const router = express.Router();
const {Signup,Login,refreshToken,Logout} = require("../controllers/Auth");
router.post("/signup",Signup);
router.post("/login",Login);
router.post("/refresh-token",refreshToken);
router.post('/logout',Logout);


module.exports = router;