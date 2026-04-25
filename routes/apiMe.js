const express = require("express");
const router = express.Router();
const {verifyToken} = require("../middlewares/authMiddleware")
const {apiMe} = require("../controllers/apiMe")
router.get("/me",verifyToken,apiMe);

module.exports = router;