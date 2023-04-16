const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const moment = require('moment');
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3030;
// Connect to MongoDB
mongoose.connect("mongodb+srv://root:root@telusko.rb3lafm.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a chat message schema
const chatMessageSchema = new mongoose.Schema({
  roomId: String,
  messages: [{
    userId: String,
    userName: String,
    message: String,
    createdAt: Date
  }]
});

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName, lastSeenMessageId) => {
    socket.join(roomId);

    // Retrieve the chat history from MongoDB if lastSeenMessageId is not null
    ChatMessage.findOne({ roomId: roomId })
      .then((chatMessage) => {
        if (!chatMessage) {
          // Chat history not found for this room
          return;
        }
        let messages;
        if (lastSeenMessageId !== null) {
          messages = chatMessage.messages.filter((message) => {
            return message._id > lastSeenMessageId;
          });
        } else {
          messages = chatMessage.messages;
        }
        // Send the next set of messages to the client
        socket.emit("chat-history", messages);
        socket.on("disconnect", () => {
          {
            // Save disconnect chat message to MongoDB
            ChatMessage.findOneAndUpdate(
              { roomId: roomId },
              { $push: { messages: { userId: userId, userName: userName, message: "Connected", createdAt: moment.utc() } } },
              { new: true, upsert: true }
            )
              .then((chatMessage) => {
                const savedMessage = chatMessage.messages[chatMessage.messages.length - 1]; // Get the last message in the array
                io.to(roomId).emit("createMessage", savedMessage, userName); // Emit the saved message instead of the original message
              })
              .catch((error) => {
                console.error(error);
              });
          }
        });
      })
      .catch((err) => {
        console.error(err);
      });

      socket.on("disconnect", () => {
        {
          // Save disconnect chat message to MongoDB
          ChatMessage.findOneAndUpdate(
            { roomId: roomId },
            { $push: { messages: { userId: userId, userName: userName, message: "Disconnected", createdAt: moment.utc() } } },
            { new: true, upsert: true }
          )
            .then((chatMessage) => {
              const savedMessage = chatMessage.messages[chatMessage.messages.length - 1]; // Get the last message in the array
              io.to(roomId).emit("createMessage", savedMessage, userName); // Emit the saved message instead of the original message
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
    socket.to(roomId).broadcast.emit("user-connected", userId);
    socket.on("typing", (message) => {
      io.to(roomId).emit("user-typing", message, userName);
    });
    socket.on("message", (message) => {
      {
        // Save the chat message to MongoDB
        ChatMessage.findOneAndUpdate(
          { roomId: roomId },
          { $push: { messages: { userId: userId, userName: userName, message: message, createdAt: moment.utc() } } },
          { new: true, upsert: true }
        )
          .then((chatMessage) => {
            const savedMessage = chatMessage.messages[chatMessage.messages.length - 1]; // Get the last message in the array
            io.to(roomId).emit("createMessage", savedMessage, userName); // Emit the saved message instead of the original message
          })
          .catch((error) => {
            console.error(error);
          });
      }
    });

  });
});


server.listen(PORT, () => {
  console.log(`The server is Listening on${PORT}`);
});
