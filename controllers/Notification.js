const Notification = require("../models/Notification");
const { asyncWrap } = require("../utils/asyncWrap");

module.exports.notification = asyncWrap(async (req, res) => {
  const notifications = await Notification.find({
    receiverId: req.userId,
  })
    .populate("senderId", "username profile")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    notifications,
  });
});

module.exports.isRead = asyncWrap(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      receiverId: req.userId,
    },
    { isRead: true },
    { new: true }
  ).populate("senderId", "username profile");

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  res.status(200).json({
    success: true,
    notification,
  });
});
module.exports.isReadAll = asyncWrap(async (req, res) => {
  const result = await Notification.updateMany(
    { receiverId: req.userId, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read",
    modifiedCount: result.modifiedCount,
  });
});