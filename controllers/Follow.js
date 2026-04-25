const User = require("../models/User");
const Notification = require("../models/Notification");
const { asyncWrap } = require("../utils/asyncWrap");

module.exports.isFollow = asyncWrap(async (req, res) => {
  const userId = req.userId;
  const targetUserId = req.params.id;

  if (userId === targetUserId) {
    return res.status(400).json({ message: "Cannot follow yourself" });
  }

  const user = await User.findById(userId);
  const targetUser = await User.findById(targetUserId);

  if (!user || !targetUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isFollowing = user.following.includes(targetUserId);


  if (isFollowing) {
    user.following.pull(targetUserId);
    targetUser.followers.pull(userId);

    await user.save();
    await targetUser.save();

    return res.json({ message: "Unfollowed" });
  }


  user.following.push(targetUserId);
  targetUser.followers.push(userId);

  await user.save();
  await targetUser.save();

 
  const notification = await Notification.create({
    senderId: userId,
    receiverId: targetUserId,
    type: "FOLLOW",
    message: "started following you",
  });


  const populatedNotification = await notification.populate(
    "senderId",
    "username profile"
  );

  
  req.io.to(targetUserId).emit("notification", populatedNotification);

  res.json({ message: "Following" });
});