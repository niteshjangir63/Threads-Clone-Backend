const { Server } = require("socket.io");

let io;


const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "https://threadsweb-psi.vercel.app",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinUser", (userId) => {
      if (!userId) return;

      socket.join(userId.toString());
      console.log("User joined room:", userId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};

module.exports = { initSocket, getIO };