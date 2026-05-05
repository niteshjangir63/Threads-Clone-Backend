const Post = require("../models/Post")
const { asyncWrap } = require("../utils/asyncWrap")
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const { cloudinary } = require("../config/cloudinary");
module.exports.createPost = asyncWrap(async (req, res) => {

  const { content } = req.body;
  let author = req.userId;

  if (!author) {
    return res.status(401).json({ message: "User Logout" });
  }


  let newPost = await new Post({ author, content, image: req.file?.path });

  await newPost.save();

  const populatePost = await newPost.populate("author")

  res.status(201).json({ message: "Posted!", success: true, post: populatePost });

})


module.exports.getPosts = asyncWrap(async (req, res) => {

  const posts = await Post.aggregate([
    { $sample: { size: 10 } }
  ]);

  const populatedPosts = await Post.populate(posts, { path: "author" });
  const latestPosts = await Post.find().populate("author").sort({ createdAt: -1 });


  res.status(200).json({
    posts: populatedPosts,
    latest: latestPosts,
    success: true
  });

});


module.exports.getPostById = asyncWrap(async (req, res) => {


  const { id } = req.params;


  const post = await Post.findById(id).populate("author").sort({ createdAt: -1 });

  if (!post) return res.status(401).json({ message: "posts not found", success: false });


  const comments = await Comment.find({
    postId: req.params.id
  }).populate("userId")


  res.status(201).json({ post, comments })

})




module.exports.deletePost = asyncWrap(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
      success: false,
    });
  }

  if (post.author.toString() !== req.userId.toString()) {
    return res.status(403).json({
      message: "Unauthorized user",
      success: false,
    });
  }

  if (post.imagePublicId) {
    await cloudinary.uploader.destroy(post.imagePublicId);
  }

  await post.deleteOne();

  res.status(200).json({
    message: "Post deleted Successfully",
    success: true,
  });
});

module.exports.likePost = asyncWrap(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author");

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
      success: false,
    });
  }

  if (!req.userId) {
    return res.status(401).json({
      message: "Unauthorized user",
      success: false,
    });
  }

  const senderId = req.userId.toString();

  if (post.likes.some((id) => id.toString() === senderId)) {
    post.likes.pull(senderId);
    await post.save();

    return res.json({
      message: "post unliked",
      success: true,
      likes: post.likes,
    });
  }

  post.likes.push(senderId);
  await post.save();

  const receiverId = post.author._id.toString();

  if (receiverId !== senderId) {
    const notification = await Notification.create({
      senderId,
      receiverId,
      postId: post._id,
      type: "LIKE",
      message: "liked your post",
    });

    const populatedNotification = await notification.populate(
      "senderId",
      "username profile"
    );

    req.io.to(receiverId).emit("notification", populatedNotification);
  }

  res.json({
    message: "post liked",
    success: true,
    likes: post.likes,
  });
});


module.exports.editPost = asyncWrap(async (req, res) => {
  const { id, content } = req.body;

  if (!id) {
    return res.status(400).json({
      message: "Post id is required",
      success: false,
    });
  }

  if (!content || !content.trim()) {
    return res.status(400).json({
      message: "Content cannot be empty",
      success: false,
    });
  }

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({
      message: "Post not found",
      success: false,
    });
  }

  post.content = content.trim();
  await post.save();

  res.status(200).json({
    message: "Post updated",
    success: true,
    post,
  });
});