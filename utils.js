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

let totalPrice = 0;
let totalItems = 0;

let shoppingCart = { totalPrice: 0, totalItems: 0 };

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
        break;
    }
  });
};

const updateCart = product => {
  product = product.split(" ");

  if (product[0] in shoppingCart) {
    shoppingCart[product[0]].quantity += parseInt(product[1], 10);
    shoppingCart.totalItems += parseInt(product[1], 10);
    shoppingCart.totalPrice += shoppingCart[product[0]].price;
    updateItem(product[0]);
  } else {
    shoppingCart[product[0]] = {
      quantity: 1,
      price: parseFloat(product[2]),
      index: counter
    };
    shoppingCart.totalItems += parseInt(product[1], 10);
    shoppingCart.totalPrice += parseFloat(product[2]);
    addItem(product[0]);
  }
  updateTotal();
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

const updateTotal = () => {
  let total = document.getElementById("total").rows[0].cells;
  total[1].innerHTML = shoppingCart.totalPrice.toFixed(2);
  total[3].innerHTML = shoppingCart.totalItems;
};

const clearProducts = () => {
  counter = 1;
  shoppingCart = { totalPrice: 0, totalItems: 0 };
  let rows = document.getElementById("products").rows.length - 1;
  for (let i = 0; i < rows; i++) {
    document.getElementById("products").deleteRow(-1);
  }
};

const clearTotal = () => {
  let total = document.getElementById("total").rows[0].cells;
  total[1].innerHTML = 0;
  total[3].innerHTML = 0;
};

const subscribe = source => {
  buttonDisplay("none", "block", "none", "none");
  socket.send(source);
};

const endReceiving = () => {
  buttonDisplay("none", "none", "block", "block");

  requester.send("False");
};

const clearShopping = () => {
  buttonDisplay("block", "none", "none", "block");

  clearProducts();
  clearTotal();
};

const buttonDisplay = (main, sec, cls, logo) => {
  document.getElementById("camera-btn").style.display = main;
  document.getElementById("vid1-btn").style.display = main;
  document.getElementById("vid2-btn").style.display = main;

  document.getElementById("video").style.display = sec;
  document.getElementById("stop").style.display = sec;

  document.getElementById("clear").style.display = cls;

  document.getElementById("logo").style.display = logo;
};
