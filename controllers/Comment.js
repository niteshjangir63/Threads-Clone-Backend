const { asyncWrap } = require("../utils/asyncWrap");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

module.exports.handleComment = asyncWrap(async (req, res) => {
  const { content } = req.body;
  const { postId } = req.params;

  if (!content) {
    return res.status(400).json({ message: "Content Required!" });
  }

  const newComment = new Comment({
    content,
    postId,
    userId: req.userId,
  });

  await newComment.save();

  const populatedComment = await newComment.populate(
    "userId",
    "username profile"
  );

  const post = await Post.findById(postId).populate("author");

  if (post) {
    const receiverId = post.author._id.toString();
    const senderId = req.userId.toString();

    if (receiverId !== senderId) {
      const notification = await Notification.create({
        senderId,
        receiverId,
        postId,
        commentId: newComment._id,
        type: "COMMENT",
        message: content,
      });

      const populatedNotification = await notification.populate(
        "senderId",
        "username profile"
      );

      req.io.to(receiverId).emit("notification", populatedNotification);
    }
  }

  res.json({
    message: "Comment Successfully!",
    comments: populatedComment,
  });
});

module.exports.getComments = asyncWrap(async (req, res) => {


    const comments = await Comment.find().populate("userId").sort({ createdAt: -1 });

    res.json({ comments })


})

module.exports.deleteComments = asyncWrap(async (req, res) => {

    const { id } = req.params;

    if (!id) return res.json({ message: "comment not found" });

    const comment = await Comment.findByIdAndDelete(id);




    res.json({ message: "Comment delete Successfully", comment })


})
