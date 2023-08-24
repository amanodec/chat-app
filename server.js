const express = require("express");
const app = express();
const http = require("http").createServer(app);
const PORT = process.env.PORT || 3000;
const path = require("path");
const public = path.join(__dirname, "/public");

// sending index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(public, "index.html"));
});

// Middleware
app.use(express.static(public));

// Listening on port 3000
http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Socket
const io = require("socket.io")(http);
let onlineUsersCount = 0; // Initialize the online users count

io.on("connection", (socket) => {
  console.log("connected");
  onlineUsersCount++; // Increment the online users count

  // Update online users count for all connected sockets
  io.emit("updateUserCount", onlineUsersCount);

  // listening on client side
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  // When a socket disconnects
  socket.on("disconnect", () => {
    onlineUsersCount--; // Decrement the online users count
    io.emit("updateUserCount", onlineUsersCount);
  });
});
