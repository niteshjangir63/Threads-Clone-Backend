const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { notification,isRead } = require("../controllers/Notification");

router.get("/",verifyToken,notification);
router.patch("/:id/read",verifyToken,isRead);

module.exports = router;    