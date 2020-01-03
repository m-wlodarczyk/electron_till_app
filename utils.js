let zmq = require("zeromq");

let socket = zmq.socket("req");
socket.connect("tcp://127.0.0.1:8889");

let requester = zmq.socket("req");
requester.connect("tcp://127.0.0.1:8888");

let footageSubscriber = zmq.socket("sub");
footageSubscriber.connect("tcp://127.0.0.1:5555");
footageSubscriber.subscribe("video");

let itemSubscriber = zmq.socket("sub");
itemSubscriber.connect("tcp://127.0.0.1:5555");
itemSubscriber.subscribe("item");

function receiveVideo() {
  footageSubscriber.on("message", function(topic, message) {
    const img = document.getElementById("video");
    img.src = `data:image/jpeg;base64,${message}`;
  });
}

function receiveDetection() {
  itemSubscriber.on("message", function(topic, message) {
    console.log(message);
  });
}

function addItem(name, quantity) {
  let tableRef = document.getElementById("products");
  let row = tableRef.insertRow(-1);

  let num = row.insertCell(0);
  let pName = row.insertCell(1);
  let pQuantity = row.insertCell(2);

  num.innerHTML = "1";
  pName.innerHTML = name;
  pQuantity.innerHTML = quantity;
}

function subscribe(source) {
  buttonDisplay("none", "block");
  socket.send(source);

  receiveVideo();
  receiveDetection();
}

function endReceiving() {
  buttonDisplay("block", "none");

  requester.send("False");
}

function buttonDisplay(btns, vids) {
  document.getElementById("camera-btn").style.display = btns;
  document.getElementById("vid1-btn").style.display = btns;
  document.getElementById("vid2-btn").style.display = btns;
  document.getElementById("logo").style.display = btns;

  document.getElementById("video").style.display = vids;
  document.getElementById("stop").style.display = vids;
}
