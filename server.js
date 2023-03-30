const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const socket = require('socket.io');

const io = socket(server);

// const express = require('express');
// const app = express();
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require('socket.io');
// const io = Server(server);


const PID = process.pid;
const PORT = process.env.PORT || 5000;
const userPreferences = new Map();
app.use(express.static(path.join(__dirname, 'public')));
io.on('connection', (socket) => {
  let user = null;

  socket.on('join', (userData) => {
    user = {
      id: socket.id,
      gender: userData.gender,
      wantsAudio: userData.wantsAudio,
      wantsVideo: userData.wantsVideo
    };

    addUserPreferences(user);

    let match = findMatch(user);
    if (match) {
      io.to(user.id).emit('match', match.id);
      io.to(match.id).emit('match', user.id);
      removeUserPreferences(user);
      removeUserPreferences(match);
    }
  });

  socket.on('disconnect', () => {
    if (user) {
      removeUserPreferences(user);
      let match = findMatch(user);
      if (match) {
        io.to(match.id).emit('cancelMatch');
        removeUserPreferences(match);
      }
    }
  });
});

function findMatch(user) {
  let preferences = getUserPreferences(user);

  let matchGender = null;
  let matchAudio = null;
  let matchVideo = null;

  for (let pref of preferences) {
    matchGender = pref.gender;
    matchAudio = pref.wantsAudio;
    matchVideo = pref.wantsVideo;

    // Check if the user is available
    let match = pool.find(otherUser =>
      otherUser.id !== user.id &&
      otherUser.gender === pref.gender &&
      otherUser.wantsAudio === pref.wantsAudio &&
      otherUser.wantsVideo === pref.wantsVideo &&
      (!matchGender || otherUser.gender === matchGender) &&
      (matchAudio === null || otherUser.wantsAudio === matchAudio) &&
      (matchVideo === null || otherUser.wantsVideo === matchVideo)
    );

    if (match) {
      return match;
    }
  }
  return null;
}

// Add the user preferences to the map for faster matchmaking
function addUserPreferences(user) {
  let pref = userPreferences.get(user.gender);
  if (!pref) {
    pref = new Map();
    userPreferences.set(user.gender, pref);
  }
  let prefArr = pref.get(getUserPreferenceString(user));
  if (!prefArr) {
    prefArr = [];
    pref.set(getUserPreferenceString(user), prefArr);
  }
  prefArr.push(user);
}

// Remove the user preferences from the map
function removeUserPreferences(user) {
  let pref = userPreferences.get(user.gender);
  if (pref) {
    let prefArr = pref.get(getUserPreferenceString(user));
    if (prefArr) {
      prefArr = prefArr.filter(otherUser => otherUser.id !== user.id);
      if (prefArr.length === 0) {
        pref.delete(getUserPreferenceString(user));
      } else {
        pref.set(getUserPreferenceString(user), prefArr);
      }
    }
    if (pref.size === 0) {
      userPreferences.delete(user.gender);
    }
  }
}

// Get the user preference string for matchmaking
function getUserPreferenceString(user) {
  return user.wantsAudio.toString() + user.wantsVideo.toString();
}

// Get the list of matching user preferences for matchmaking
function getUserPreferences(user) {
  let preferences = [];
  let pref = userPreferences.get(user.gender);
  if (pref) {
    let prefArr = pref.get(getUserPreferenceString(user));
    if (prefArr) {
      preferences.push(...prefArr);
    }
  }
  return preferences;
}

server.listen(PORT, () => {
  console.log(`The server is Listening on http://localhost:${PORT} \nPID: ${PID}\n`);
});
