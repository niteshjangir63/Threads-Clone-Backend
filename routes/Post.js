const express = require("express");
const router = express.Router();
const { createPost, getPosts ,deletePost,likePost,getPostById,editPost} = require("../controllers/Post");
const { verifyToken } = require("../middlewares/authMiddleware")
const upload = require("../middlewares/uploads")

router.post("/create", verifyToken, upload.single("image"),createPost);
router.get("/posts", getPosts);
router.get("/post/:id",getPostById)
router.delete("/post/delete/:id",verifyToken,deletePost);
router.post("/post/like/:id",verifyToken,likePost)
router.put("/edit/post",verifyToken,editPost)


module.exports = router;