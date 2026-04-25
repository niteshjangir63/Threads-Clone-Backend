const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/authMiddleware");
const { handleComment, getComments, deleteComments } = require("../controllers/Comment")
router.post("/:postId", verifyToken, handleComment);
router.get("/get", getComments);
router.delete("/delete/:id", verifyToken,deleteComments);



module.exports = router;