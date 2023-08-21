const express = require("express");
const app = express();
const http = require("http").createServer(app);
const PORT = process.env.PORT || 3000;
const path = require("path");
var public = path.join(__dirname, "/public");

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

const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log("connected");
    // listening on client side
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg);
    })
})
