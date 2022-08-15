const express = require("express");
const app = express();
const server = require("http").Server(app);
const { v4: uuidv4 } = require("uuid");
app.set("view engine", "ejs");
let usersNum = 0;
const users = {};
const io = require("socket.io")(server, {
  cors: {
    origin: '*'
  }
});
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use("/peerjs", peerServer);
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  usersNum += 1;
  socket.on("join-room", (roomId, userId, userName) => {
    users[socket.id] = username;
    io.emit('broadcast', `Online: ${usersNum}`);
    socket.join(roomId);

    socket.on("message", (message) => {
      io.to(roomId).emit("createMessage", message, userName);
    });
  });
});
io.on('disconnect', () => {
  io.broadcast.emit('user-disconnected', users[socket.id]);
  usersNum -= 1;
  io.emit('broadcast', `Online: ${usersNum}`);
  delete users[socket.id];
});
server.listen(process.env.PORT || 3030);
