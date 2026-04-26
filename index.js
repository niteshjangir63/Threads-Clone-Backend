const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const express = require("express");
const app = express();

const http = require("http");
const { Server } = require("socket.io");

const cookies = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const allowedOrigins = [
  "http://localhost:5173",
  "https://threads.niteshjangir426.workers.dev",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookies());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const connectDB = require("./config/connectDb");
connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
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

app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api", require("./routes/apiMe"));
app.use("/", require("./routes/Auth"));
app.use("/profile", require("./routes/Profile"));
app.use("/", require("./routes/Post"));
app.use("/", require("./routes/User"));
app.use("/comment", require("./routes/Comment"));
app.use("/", require("./routes/Follow"));
app.use("/", require("./routes/forgot"));
app.use("/notifications", require("./routes/Notification"));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running with sockets on port ${PORT}`);
});