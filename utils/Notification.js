const Notification = require("../models/Notification");
const { getIO, getOnlineUsers } = require("../sockets/socket");

const sendNotification = async ({
    sender,
    receiver,
    type,
    post,
    message
}) => {


    const notification = await Notification.create({
        sender,
        receiver,
        type,
        post,
        message
    });

    const populated = await notification.populate("sender", "username");


    const io = getIO();
    const onlineUsers = getOnlineUsers();

    const socketId = onlineUsers[receiver];

    if (socketId) {
        io.to(socketId).emit("notification", populated);
    }

    return populated;
};

module.exports = sendNotification;