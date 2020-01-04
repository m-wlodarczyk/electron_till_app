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

let counter = 1;

const receiveVideo = () => {
  footageSubscriber.on("message", function(topic, message) {
    const img = document.getElementById("video");
    img.src = `data:image/jpeg;base64,${message}`;
  });
};

const receiveDetection = () => {
  itemSubscriber.on("message", function(topic, message) {
    console.log("Item");
    console.log(message);
    addItem("sample", "quantity");
  });
};

const addItem = (name, quantity) => {
  let tableRef = document.getElementById("products");
  let row = tableRef.insertRow(-1);

  let num = row.insertCell(0);
  let pName = row.insertCell(1);
  let pQuantity = row.insertCell(2);

  num.innerHTML = counter;
  pName.innerHTML = name;
  pQuantity.innerHTML = quantity;
  counter++;
};

const clearTable = () => {
  counter = 1;
  let rows = document.getElementById("products").rows.length - 1;
  for (let i = 0; i < rows; i++) {
    document.getElementById("products").deleteRow(-1);
  }
};

const subscribe = source => {
  buttonDisplay("none", "block");
  socket.send(source);

  receiveVideo();
  receiveDetection();
};

const endReceiving = () => {
  buttonDisplay("block", "none");

  requester.send("False");

  clearTable();
};

const buttonDisplay = (btns, vids) => {
  document.getElementById("camera-btn").style.display = btns;
  document.getElementById("vid1-btn").style.display = btns;
  document.getElementById("vid2-btn").style.display = btns;
  document.getElementById("logo").style.display = btns;

  document.getElementById("video").style.display = vids;
  document.getElementById("stop").style.display = vids;
};
