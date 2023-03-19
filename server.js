const path = require('path');
const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { 
  pingInterval: 10000, 
  pingTimeout: 5000,
  maxHttpBufferSize: 1e8,
});
io.sockets.setMaxListeners(5000);
const mydata = [
  {
    "name": "Gil Peters",
    "isReadyToTalk": false,
    "isVerified": false,
    "opentalks": 4111,
    "rating": 4387,
    "profile": "https://picsum.photos//200?sig=",
    "gender": "Sociis Natoque Inc.",
    "talkingmin": 2905,
    "token": "pede. Nunc sed orci lobortis augue scelerisque mollis. Phasellus libero mauris, aliquam eu, accumsan sed, facilisis vitae, orci. Phasellus dapibus quam quis diam. Pellentesque habitant morbi tristique senectus",
    "uId": "adipiscing lacus. Ut nec urna",
    "username": "Ryder"
  },
  {
    "name": "Rajah Chandler",
    "isReadyToTalk": true,
    "isVerified": false,
    "opentalks": 7551,
    "rating": 3852,
    "profile": "https://picsum.photos//200?sig=",
    "gender": "Nulla LLP",
    "talkingmin": 2633,
    "token": "ligula tortor, dictum eu, placerat eget, venenatis a, magna. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Etiam laoreet, libero et tristique pellentesque, tellus sem mollis dui, in",
    "uId": "in, tempus eu, ligula. Aenean",
    "username": "Tamekah"
  },
  {
    "name": "Gage Henson",
    "isReadyToTalk": false,
    "isVerified": true,
    "opentalks": 2426,
    "rating": 9232,
    "profile": "https://picsum.photos//200?sig=",
    "gender": "Tortor Nunc Corporation",
    "talkingmin": 3817,
    "token": "Aliquam vulputate ullamcorper magna. Sed eu eros. Nam consequat dolor vitae dolor. Donec fringilla. Donec feugiat metus sit amet ante. Vivamus non lorem vitae odio sagittis semper. Nam",
    "uId": "ultrices. Vivamus rhoncus. Donec est.",
    "username": "Ginger"
  },
  {
    "name": "Dorian Trujillo",
    "isReadyToTalk": true,
    "isVerified": false,
    "opentalks": 5167,
    "rating": 5731,
    "profile": "https://picsum.photos//200?sig=",
    "gender": "Nec PC",
    "talkingmin": 7267,
    "token": "Donec consectetuer mauris id sapien. Cras dolor dolor, tempus non, lacinia at, iaculis quis, pede. Praesent eu dui. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur",
    "uId": "diam vel arcu. Curabitur ut",
    "username": "Josephine"
  },
  {
    "name": "Flynn Dickson",
    "isReadyToTalk": true,
    "isVerified": false,
    "opentalks": 7729,
    "rating": 6772,
    "profile": "https://picsum.photos//200?sig=",
    "gender": "Nec Euismod In LLC",
    "talkingmin": 1381,
    "token": "cursus in, hendrerit consectetuer, cursus et, magna. Praesent interdum ligula eu enim. Etiam imperdiet dictum magna. Ut tincidunt orci quis lectus. Nullam suscipit, est ac facilisis facilisis, magna",
    "uId": "sodales. Mauris blandit enim consequat",
    "username": "Margaret"
  },
  {
    "name": "Alvin Hinton",
    "isReadyToTalk": true,
    "isVerified": true,
    "opentalks": 5165,
    "rating": 3080,
    "profile": "https://picsum.photos//200?sig=",
    "gender": "Fringilla Limited",
    "talkingmin": 7836,
    "token": "sed turpis nec mauris blandit mattis. Cras eget nisi dictum augue malesuada malesuada. Integer id magna et ipsum cursus vestibulum. Mauris magna. Duis dignissim tempor arcu. Vestibulum ut",
    "uId": "pede et risus. Quisque libero",
    "username": "Patrick"
  },
  {
    "name": "Hayley Davis",
    "isReadyToTalk": false,
    "opentalks": 2370,
    "isVerified": false,
    "rating": 9793,
    "profile": "https://picsum.photos//200?sig=",
    "gender": "Erat Volutpat Institute",
    "talkingmin": 8458,
    "token": "arcu iaculis enim, sit amet ornare lectus justo eu arcu. Morbi sit amet massa. Quisque porttitor eros nec tellus. Nunc lectus pede, ultrices a, auctor non, feugiat nec,",
    "uId": "Suspendisse non leo. Vivamus nibh",
    "username": "Caldwell"
  },
  {
    "name": "Adrian Cotton",
    "isReadyToTalk": false,
    "isVerified": false,
    "opentalks": 2277,
    "rating": 5069,
    "profile": "https://picsum.photos//200?sig=",
    "gender": "Fringilla Euismod Foundation",
    "talkingmin": 5649,
    "token": "Quisque ornare tortor at risus. Nunc ac sem ut dolor dapibus gravida. Aliquam tincidunt, nunc ac mattis ornare, lectus ante dictum mi, ac mattis velit justo nec ante.",
    "uId": "lobortis quam a felis ullamcorper",
    "username": "Sybill"
  },
  {
    "name": "Kessie Newman",
    "isReadyToTalk": true,
    "isVerified": true,
    "opentalks": 6648,
    "rating": 9144,
    "profile": "https://picsum.photos//200?sig=",
    "gender": "Et Ultrices Institute",
    "talkingmin": 2685,
    "token": "ac mattis ornare, lectus ante dictum mi, ac mattis velit justo nec ante. Maecenas mi felis, adipiscing fringilla, porttitor vulputate, posuere vulputate, lacus. Cras interdum. Nunc sollicitudin commodo",
    "uId": "nisi. Mauris nulla. Integer urna.",
    "username": "Hamilton"
  },
  {
    "name": "Ori Ortiz",
    "isReadyToTalk": false,
    "isVerified": false,
    "opentalks": 4382,
    "rating": 9474,
    "profile": "https://picsum.photos//200?sig=",
    "gender": "Enim Non Nisi Foundation",
    "talkingmin": 3823,
    "token": "neque sed sem egestas blandit. Nam nulla magna, malesuada vel, convallis in, cursus et, eros. Proin ultrices. Duis volutpat nunc sit amet metus. Aliquam erat volutpat. Nulla facilisis.",
    "uId": "nisi dictum augue malesuada malesuada.",
    "username": "Leah"
  },

]
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
      socket.on('insert-all', (users) => {

        const socketId = socket.id;
        const usersWithSocketId = mydata.map((user) => ({ ...user, id: socketId }));

        usersCollection.insertMany(usersWithSocketId)
          .then(() => {
            console.log(`${usersWithSocketId.length} users added to MongoDB`);
            sendUsersList(io);
          })
          .catch((err) => {
            console.log('Error adding users to MongoDB:', err);
          });
      });
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
