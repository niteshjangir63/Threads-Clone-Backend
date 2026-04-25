const express = require("express");
const router = express.Router();

const {isFollow} = require("../controllers/Follow")
const {verifyToken} = require("../middlewares/authMiddleware") 

router.post("/follow/:id",verifyToken,isFollow);

module.exports = router;