// eslint-disable-next-line no-undef
const socket = io.connect('/');

const message = document.getElementById('message-input');
const sendMsg = document.getElementById('send-message');
const msgSound = document.getElementById('notification-sound');
const user = document.getElementById('username-input');
const sendUser = document.getElementById('send-username');
const displayMsg = document.getElementById('display-message');
const typingLabel = document.getElementById('typing-label');
const chatWindow = document.getElementById('chat-window');
const usersCounter = document.getElementById('users-counter');
const msgErr = document.getElementById('message-error');
const userErr = document.getElementById('username-error');
const join = document.getElementById('you-joined');
const chat = document.getElementById('chat');
const login = document.getElementById('login-page');
var userName="";

const params = new URLSearchParams(window.location.search);
      userName = params.get('userName');
      userErr.innerHTML = '';
      login.style.display = 'none';
      chat.style.display = 'block';
      join.innerHTML = '<p>Welcome '+userName+' to IELTS group chat!<p>';
      socket.emit('new-user', userName);

      var peer = new Peer(undefined, {
        path: "/peerjs",
        host: "/",
        port: "443",
      });

      let myVideoStream;
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false,
        })
        .then((stream) => {
          myVideoStream = stream;
          addVideoStream(myVideo, stream);
      
          peer.on("call", (call) => {
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", (userVideoStream) => {
              addVideoStream(video, userVideoStream);
            });
          }); 
         });

         const connectToNewUser = (userId, stream) => {
          const call = peer.call(userId, stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        };
        peer.on("open", (id) => {
          socket.emit("join-room", "123456", id, user);
        });  
        
        const addVideoStream = (video, stream) => {
          video.srcObject = stream;
          video.addEventListener("loadedmetadata", () => {
            video.play();
             videoGrid.append(video);
            adjustWindows();
            myVideoStream.getAudioTracks()[0].enabled = false;
            html = `<i class="fas fa-microphone-slash"></i>`;
            muteButton.classList.toggle("background__red");
            muteButton.innerHTML = html;
          });
        };

        const inviteButton = document.querySelector("#inviteButton");
        const muteButton = document.querySelector("#muteButton");
        const stopVideo = document.querySelector("#stopVideo");
        muteButton.addEventListener("click", () => {
          const enabled = myVideoStream.getAudioTracks()[0].enabled;
          if (enabled) {
            myVideoStream.getAudioTracks()[0].enabled = false;
            html = `<i class="fas fa-microphone-slash"></i>`;
            muteButton.classList.toggle("background__red");
            muteButton.innerHTML = html;
          } else {
            myVideoStream.getAudioTracks()[0].enabled = true;
            html = `<i class="fas fa-microphone"></i>`;
            muteButton.classList.toggle("background__red");
            muteButton.innerHTML = html;
          }
        });
        
        stopVideo.addEventListener("click", () => {
          const enabled = myVideoStream.getVideoTracks()[0].enabled;
          if (enabled) {
            myVideoStream.getVideoTracks()[0].enabled = false;
            html = `<i class="fas fa-video-slash"></i>`;
            stopVideo.classList.toggle("background__red");
            stopVideo.innerHTML = html;
          } else {
            myVideoStream.getVideoTracks()[0].enabled = true;
            html = `<i class="fas fa-video"></i>`;
            stopVideo.classList.toggle("background__red");
            stopVideo.innerHTML = html;
          }
        });
        
        inviteButton.addEventListener("click", (e) => {
         
        });

sendUser.addEventListener('click', () => {
  // if (user.value === null || user.value.trim().length === 0) {
  //   userErr.innerHTML = '🚨 Name is required!';
  //   return;
  // }
});
function checkMatch(userMessage){

  let originalMessage = userMessage;
  let inputMessage = userMessage.toLowerCase();    
  let result = inputMessage.match(/(asshole|ass hole|fuck off|fuck you|sucking|gspot|fuck|fuckoff|fuckface|fuckface|ass|cumbubble|bugger|cumdumpsterfuck|cocknose|wanker|fuck you|bollocks|shitbag|knobhead|twatwaffle|shit|choad|thundercunt|pissoff|bitch|tits|dickhead|knobjockey|asshole|crikey|shitpouch|cuntpuddle|dickweed|rubbish|jizzstain|dickweasel|cunt|pissflaps|nonce|quim|bitch|shag|pisskidney|bawbag|fuck|trumpet|bastard)/g);
//  var slangLengh = result.length;
  //document.getElementById("matchResult").innerHTML = result;
  console.log(result);
  if(result!=null){
    //Copy message to support team.
    return 1;
  }else{
    return 0;
  }
}
sendMsg.addEventListener('click', () => {

  if (message.value === null || message.value.trim().length === 0) {
  
    msgErr.innerHTML = '🚨 Message is required!';
    return;
  }
let chresult= checkMatch(message.value);
let systemMessage="";
if(chresult==1){
    systemMessage="<br/><span style='color: red;'>🚨 Using bad word may ban your account permanantly</span>";
}
  socket.emit('new-message', {
    
    message: message.value + systemMessage,
    username: userName,
  });
  message.value = '';
  msgErr.innerHTML = '';
});

message.addEventListener('keypress', () => {
  socket.emit('is-typing', userName);
});


socket.on('user-connected', (username) => {
  displayMsg.innerHTML += `<p><strong>${username}</strong> has connected!</p>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;
  msgSound.play();
});

socket.on('broadcast', (number) => {
  usersCounter.innerHTML = number;
});

socket.on('new-message', (data) => {
  typingLabel.innerHTML = '';
  displayMsg.innerHTML += `<p><strong>${data.username}</strong><em> at ${new Date().getHours()}:${new Date().getMinutes()}</em> : ${data.message}</p>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;
  msgSound.play();
});

socket.on('is-typing', (username) => {
  typingLabel.innerHTML = `<p>${username} is typing...</p>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;
});

socket.on('user-disconnected', (username) => {
  if (username == null) {
    displayMsg.innerHTML += '<p>Unlogged user has disconnected!</p>';
    chatWindow.scrollTop = chatWindow.scrollHeight;
  } else {
    displayMsg.innerHTML += `<p><strong>${username}</strong> has disconnected!</p>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
    msgSound.play();
  }
});

