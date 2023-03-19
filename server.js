const path = require('path');
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const server = require('http').Server(app);
const socket = require('socket.io');

const io = require('socket.io')(server, {
  maxHttpBufferSize: 1e8, // Increase max HTTP buffer size to handle large payloads
  transports: ['websocket'], // Use only the websocket transport for better performance
  pingTimeout: 60000, // Increase the ping timeout to prevent disconnects due to slow network
  pingInterval: 25000, // Decrease the ping interval for faster heartbeat checks
  upgradeTimeout: 30000, // Increase the upgrade timeout to handle slow upgrades
  allowUpgrades: true, // Allow upgrades to websocket transport
  cors: { origin: '*' }, // Allow all CORS requests
  cookie: false, // Disable cookie support
  perMessageDeflate: { // Enable per-message deflate compression
    threshold: 1024,
  },
  httpCompression: true, // Enable HTTP compression
  serveClient: false, // Do not serve the Socket.io client file
});

io.sockets.setMaxListeners(5000);

const PID = process.pid;
const PORT = process.env.PORT || 5000;

const mongoURI = 'mongodb://mongo:5XGOcoMpsJX6xGk9nnsH@containers-us-west-175.railway.app:7581';

// Connect to MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((client) => {
    console.log('Connected to MongoDB');

    const db = client.db('myapp');
    const usersCollection = db.collection('users');

    app.use(express.static(path.join(__dirname, 'public')));

    // Send the list of all users to the connected client
    const sendUsersList = (socket) => {
      usersCollection.find().toArray()
        .then((users) => {
          socket.emit('users-list', users);
        })
        .catch((err) => {
          console.log('Error getting users from MongoDB:', err);
        });
    };

    // eslint-disable-next-line no-shadow
    io.on('connection', (socket) => {
      console.log(`The socket is connected! Socket id: ${socket.id}`);

      // Send the list of all users to the new client
      sendUsersList(socket);

      // Add a new user to the database
      socket.on('new-user', (user) => {
        user.id = socket.id;
        usersCollection.insertOne(user)
          .then(() => {
            console.log(`User ${user.name} added to MongoDB`);
            io.emit('user-add', user);
          })
          .catch((err) => {
            console.log('Error adding user to MongoDB:', err);
          });
      });
      // socket.on('insert-all', (users) => {

      //   const socketId = socket.id;
      //   const usersWithSocketId = mydata.map((user) => ({ ...user, id: socketId }));

      //   usersCollection.insertMany(usersWithSocketId)
      //     .then(() => {
      //       console.log(`${usersWithSocketId.length} users added to MongoDB`);
      //       sendUsersList(io);
      //     })
      //     .catch((err) => {
      //       console.log('Error adding users to MongoDB:', err);
      //     });
      // });
      socket.on('is-typing', (username) => {
        socket.broadcast.emit('is-typing', username);
      });

      // Remove a user from the database
      socket.on('disconnect', () => {
        console.log(`User ${socket.id} Want to remove from MongoDB`);
        usersCollection.findOneAndDelete({ id: socket.id })
          .then((result) => {
            const user = result.value;
            if (user) {
              io.emit('user-removed', user);
              console.log(`User ${user.name} removed from MongoDB`);
            }
          })
          .catch((err) => {
            console.log('Error removing user from MongoDB:', err);
          });
      });
    });

    server.listen(PORT, () => {
      console.log(`The server is Listening on http://localhost:${PORT} \nPID: ${PID}\n`);
    });
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err);
  });
