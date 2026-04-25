const express = require("express");
const router = express.Router();
const {searchUser} = require("../controllers/User");
router.get("/search",searchUser);

module.exports = router;