const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Keep track of connected users
const connectedUsers = new Map();

// Handle new connections
io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Add the user to the list of connected users
  connectedUsers.set(socket.id, { id: socket.id });

  // Send the updated list of users to all connected clients
  io.emit('users', Array.from(connectedUsers.values()));

  // Listen for disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    // Remove the user from the list of connected users
    connectedUsers.delete(socket.id);

    // Send the updated list of users to all connected clients
    io.emit('users', Array.from(connectedUsers.values()));
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
