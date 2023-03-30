const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const socket = require('socket.io');
const io = socket(server);
const PID = process.pid;
const PORT = process.env.PORT || 5000;
const userPreferences = new Map();
app.use(express.static(path.join(__dirname, 'public')));
const MATCH_TIMEOUT = 30000; // 5 seconds

let users = [];
let waitingUsers = [];

io.on('connection', (socket) => {
  // When a new user connects, add them to the list of users
  users.push({
    id: socket.id,
    gender: null, // Set gender to null initially
    lookingFor: 'any', // Set lookingFor to 'any' initially
    profile: null, // Set profile to null initially
    timeoutId: null, // Set timeoutId to null initially
  });
  console.log("Users list ", users)

  // Handle user disconnection
  socket.on('disconnect', () => {
    const user = users.find((user) => user.id === socket.id);
    users = users.filter((user) => user.id !== socket.id);
    waitingUsers = waitingUsers.filter((user) => user.id !== socket.id);
    if (user.timeoutId) {
      clearTimeout(user.timeoutId);
    }
  });

  // Handle gender selection
  socket.on('select gender', (gender) => {
    const user = users.find((user) => user.id === socket.id);
    if (user) {
      user.gender = gender;
      // Try to find a match for the user
      matchUser(user);
    }
  });

  // Handle lookingFor selection
  socket.on('select lookingFor', (lookingFor) => {
    const user = users.find((user) => user.id === socket.id);
    if (user) {
      user.lookingFor = lookingFor;
      console.log("select lookingFor ", user)
      // Try to find a match for the user
      matchUser(user);
    }
  });

  // Handle profile update
  socket.on('update profile', (profile) => {
    const user = users.find((user) => user.id === socket.id);
    console.log("select lookingFor ", user)
    if (user) {
      user.profile = profile;
    }
  });

  // Function to find a match for a user
  const matchUser = (user) => {
    // Clear any existing timeout
    if (user.timeoutId) {
      clearTimeout(user.timeoutId);
      user.timeoutId = null;
    }

    // First, check if there are any waiting users who match the user's preferences
    const otherUser = waitingUsers.find(
      (other) =>
        other.id !== user.id &&
        other.gender !== user.gender &&
        (user.lookingFor === 'any' || other.gender === user.lookingFor)
    );
    if (otherUser) {
      // Found a match, emit 'match' event to both users
      waitingUsers = waitingUsers.filter((other) => other.id !== otherUser.id);
      io.to(user.id).to(otherUser.id).emit('match', otherUser.profile);
    } else {
      // No waiting user found, add the user to the waiting list
      waitingUsers.push(user);
      // Set a timeout to remove the user from the waiting list after a certain time
      user.timeoutId = setTimeout(() => {
        waitingUsers = waitingUsers.filter((other) => other.id !== user.id);
        user.timeoutId = null;
      }, MATCH_TIMEOUT);
    }
  };

  // Handle cancel search
  socket.on('cancel search', () => {
    const user = users.find((user) => user.id === socket.id);
    if (user.timeoutId) {
      clearTimeout(user.timeoutId);
      user.timeoutId = null;
    }
    waitingUsers = waitingUsers.filter((user) => user.id !== socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`The server is Listening on http://localhost:${PORT} \nPID: ${PID}\n`);
});
