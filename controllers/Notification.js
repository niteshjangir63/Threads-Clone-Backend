const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");
const {asyncWrap} = require("../utils/asyncWrap")
module.exports.notification = (asyncWrap(async (req, res) => {
  const notifications = await Notification.find({
    receiverId: req.userId,
  })
    .populate("senderId", "username profile")
    .sort({ createdAt: -1 });

  res.json({ notifications });
}));




 module.exports.isRead = (asyncWrap( async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      receiverId: req.userId,
    },
    { isRead: true },
    { new: true }
  );

  res.json({ success: true, notification });
}));