let zmq = require("zeromq");

let socket = zmq.socket("req");
socket.connect("tcp://127.0.0.1:8889");

let requester = zmq.socket("req");
requester.connect("tcp://127.0.0.1:8888");

let subscriber = zmq.socket("sub");
subscriber.connect("tcp://127.0.0.1:5555");
subscriber.subscribe("video");
subscriber.subscribe("item");

let counter = 1;

let shoppingCart = {};

const receiveData = () => {
  subscriber.on("message", function(topic, message) {
    topic = topic.toString();
    switch (topic) {
      case "video":
        const img = document.getElementById("video");
        img.src = `data:image/jpeg;base64,${message}`;
        break;
      case "item":
        updateCart(message.toString());
    }
  });
};

const updateCart = product => {
  product = product.split(" ");

  if (product[0] in shoppingCart) {
    shoppingCart[product[0]].quantity += parseInt(product[1], 10);
    updateItem(product[0]);
  } else {
    shoppingCart[product[0]] = {
      quantity: 1,
      price: parseFloat(product[2]),
      index: counter
    };
    addItem(product[0]);
  }
};

const addItem = productName => {
  let tableRef = document.getElementById("products");
  let row = tableRef.insertRow(-1);

  let num = row.insertCell(0);
  let pName = row.insertCell(1);
  let pPrice = row.insertCell(2);
  let pQuantity = row.insertCell(3);

  num.innerHTML = counter;
  pName.innerHTML = productName;
  pPrice.innerHTML =
    shoppingCart[productName].quantity * shoppingCart[productName].price;
  pQuantity.innerHTML = shoppingCart[productName].quantity;
  counter++;
};

const updateItem = productName => {
  let row = document.getElementById("products").rows[
    shoppingCart[productName].index
  ].cells;

  row[2].innerHTML = (
    shoppingCart[productName].quantity * shoppingCart[productName].price
  ).toFixed(2);
  row[3].innerHTML = shoppingCart[productName].quantity;
};

const clearTable = () => {
  counter = 1;
  shoppingCart = {};
  let rows = document.getElementById("products").rows.length - 1;
  for (let i = 0; i < rows; i++) {
    document.getElementById("products").deleteRow(-1);
  }
};

const subscribe = source => {
  buttonDisplay("none", "block");
  socket.send(source);
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
