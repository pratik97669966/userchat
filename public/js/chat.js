// // eslint-disable-next-line no-undef
// const socket = io.connect('/');

// const message = document.getElementById('message-input');
// const sendMsg = document.getElementById('send-message');
// const msgSound = document.getElementById('notification-sound');
// const user = document.getElementById('username-input');
// const displayMsg = document.getElementById('display-message');
// const typingLabel = document.getElementById('typing-label');
// const chatWindow = document.getElementById('chat-window');
// const usersCounter = document.getElementById('users-counter');
// const msgErr = document.getElementById('message-error');
// // const join = document.getElementById('you-joined');
// const chat = document.getElementById('chat');

// var userName = "";
// var userNametrs = "";

// const params = new URLSearchParams(window.location.search);
// userName = params.get('userName').slice(0, -28);
// chat.style.display = 'block';
// // join.innerHTML = '<p>Welcome ' + userName + '<p>';
// socket.emit('new-user', userName);

// sendMsg.addEventListener('click', () => {

//   if (message.value === null || message.value.trim().length === 0) {
//     msgErr.innerHTML = '🚨 Message is required!';
//     return;
//   }

//   socket.emit('new-message', {
//     message: message.value + systemMessage,
//     username: userName,
//   });
//   message.value = '';
//   msgErr.innerHTML = '';
// });

// socket.on('user-connected', (username) => {
//   displayMsg.innerHTML += `<p><strong>${username}</strong> has connected!</p>`;
//   chatWindow.scrollTop = chatWindow.scrollHeight;
// });

// socket.on('broadcast', (number) => {
//   usersCounter.innerHTML = number;
// });

// socket.on('new-message', (data) => {
//   typingLabel.innerHTML = '';
//   displayMsg.innerHTML += `<p><strong>${data.username}</strong> : ${data.message}</p>`;
//   chatWindow.scrollTop = chatWindow.scrollHeight;
  
// });

// socket.on('is-typing', (username) => {
//   typingLabel.innerHTML = `<p>${username} is typing...</p>`;
//   chatWindow.scrollTop = chatWindow.scrollHeight;
// });

// socket.on('user-disconnected', (username) => {
//   if (username == null) {
//     displayMsg.innerHTML += '<p>Unlogged user has disconnected!</p>';
//     chatWindow.scrollTop = chatWindow.scrollHeight;
//   } else {
//     displayMsg.innerHTML += `<p><strong>${username}</strong> has disconnected!</p>`;
//     chatWindow.scrollTop = chatWindow.scrollHeight;
    
//   }
// });

