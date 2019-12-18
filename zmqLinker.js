function send_msg() {
  document.getElementById("camera-btn").style.display = "block";
  document.getElementById("vid1-btn").style.display = "block";
  document.getElementById("vid2-btn").style.display = "block";
  document.getElementById("video").style.display = "none";
  document.getElementById("stop").style.display = "none";
  const imgElem = document.getElementById("video");
  imgElem.src = `data:image/jpeg;base64,`;
  var zmq = require("zeromq"),
    requester = zmq.socket("req");
  requester.connect("tcp://127.0.0.1:8888");
  requester.send("False");
  console.log("sent");
}

function sub() {
  var zmq = require("zeromq"),
    sock = zmq.socket("pull");

  sock.connect("tcp://127.0.0.1:5555");

  sock.on("message", function(msg) {
    const imgElem = document.getElementById("video");
    imgElem.src = `data:image/jpeg;base64,${msg}`;
  });
}

function rec_video() {
  var zmq = require("zeromq"),
    sock = zmq.socket("pull");

  sock.connect("tcp://127.0.0.1:6666");

  sock.on("message", function(msg) {
    const imgElem = document.getElementById("video");
    imgElem.src = `data:image/jpeg;base64,${msg}`;
  });
}

// function sub() {
//   var zmq = require("zeromq"),
//     sock = zmq.socket("sub");

//   sock.connect("tcp://127.0.0.1:3000");
//   sock.subscribe("kitty cats");
//   console.log("Subscriber connected to port 3000");

//   sock.on("message", function(message) {
//     console.log(message);
//   });
// }
