const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const showChat = document.querySelector("#showChat");
const backBtn = document.querySelector(".header__back");
const usersCounter = document.getElementById('users-counter');
const enabled = myVideoStream.getAudioTracks()[0].enabled;
myVideo.muted = true;
document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
backBtn.addEventListener("click", () => {
  document.querySelector(".main__left").style.display = "flex";
  document.querySelector(".main__left").style.flex = "1";
  document.querySelector(".main__right").style.display = "none";
  document.querySelector(".header__back").style.display = "none";
});

showChat.addEventListener("click", () => {
  document.querySelector(".main__right").style.display = "flex";
  document.querySelector(".main__right").style.flex = "1";
  document.querySelector(".main__left").style.display = "none";
  document.querySelector(".header__back").style.display = "block";
});
const params = new URLSearchParams(window.location.search);
const user = params.get('userName');

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

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
      socket.emit("message", `<p><strong>${user}</strong> has connected!</p>`);
  text.value = "";
    });
  });

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};
socket.on('user-disconnected', (userId) => {
  if (user == null) {
    socket.emit("message", `user has Disconnected !`);
  text.value = "";
  } else {
    socket.emit("message", `<p><strong>${user}</strong> has Disconnected !</p>`);
  text.value = "";
  }
});
peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, user);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
     videoGrid.append(video);
    adjustWindows();
    
  });
  myVideoStream.getAudioTracks()[0].enabled = false;
  html = `<i class="fas fa-microphone-slash"></i>`;
  muteButton.classList.toggle("background__red");
  muteButton.innerHTML = html;
};

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
  if (text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

socket.on('broadcast', (number) => {
  usersCounter.innerHTML = number;
});

text.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && text.value.length !== 0) {
    socket.emit("message", text.value);
    text.value = "";
  }
});

const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");
muteButton.addEventListener("click", () => {

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

socket.on("createMessage", (message, userName) => {
  messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <b><i class="far fa-user-circle"></i> <span> ${
           userName
        }</span> </b>
        <span>${message}</span>
    </div>`;
    var myMessage = document.getElementsByClassName("main__chat_window")[0];
			myMessage.scrollTop = myMessage.scrollHeight;
});
// santosh added

      //  $(document).ready(function(){
      //      //alert("Hi");
           
          // $("#btnAddWindow").click(function(){   
          //   var cnt = $('.mainContainer .item').length;
          //   if(cnt != 6) {
          //       $('.mainContainer').append('<div class="item" style="flex-basis: 90%;">&nbsp;</div>');
          //       adjustWindows();
          //   }
          //   else{
          //       alert("Char room is full...!");
          //   }
          // });

          // $("#btnRemoveWindow").click(function(){
          //   //$("div p:nth-child(2)").css("background-color", "yellow");
          //   var cnt = $('.mainContainer .item').length;
          //   //alert(cnt);
          //   if(cnt > 0) {
          //       $(".mainContainer .item:nth-child(1)").remove();
          //       adjustWindows();
          //   }
          //   else {
          //       alert("No window delete");
          //   }
          // });

        // });

        function adjustWindows()
        {
            var cnt = $('#video-grid video').length;
            // if(cnt == 0)
            // {
            //     alert("No windows available");
            // }
            // else
            // {
            //     alert("No of windows: " + cnt);
                if(cnt == 1) {
                    $("#video-grid video:nth-child(1)").css("flex-basis", "90%");
                    return;
                }
                else if(cnt == 2) {
                    $("#video-grid video:nth-child(1)").css("flex-basis", "90%");
                    $("#video-grid video:nth-child(2)").css("flex-basis", "90%");
                    return;
                }
                else if(cnt == 3)
                {
                    $("#video-grid video:nth-child(1)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(2)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(3)").css("flex-basis", "90%");
                    return;
                }
                else if(cnt == 4)
                {
                    $("#video-grid video:nth-child(1)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(2)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(3)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(4)").css("flex-basis", "45%");
                    return;  
                }
                else if(cnt == 5)
                {
                    $("#video-grid video:nth-child(1)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(2)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(3)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(4)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(5)").css("flex-basis", "90%");
                    return;  
                }
                else if(cnt == 6)
                {
                    $("#video-grid video:nth-child(1)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(2)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(3)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(4)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(5)").css("flex-basis", "45%");
                    $("#video-grid video:nth-child(6)").css("flex-basis", "45%");
                    return;  
                }
            }
        // }