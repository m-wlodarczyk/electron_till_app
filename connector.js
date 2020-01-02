let zmq = require("zeromq");

class Connector {
  constructor() {
    this.socket = zmq.socket("req");
    this.requester = zmq.socket("req");
    this.footageSubscriber = zmq.socket("sub");
    this.itemSubscriber = zmq.socket("sub");
    this.socket.connect("tcp://127.0.0.1:8889");
    this.requester.connect("tcp://127.0.0.1:8888");
    this.footageSubscriber.connect("tcp://127.0.0.1:5555");
    this.itemSubscriber.connect("tcp://127.0.0.1:5555");
    this.footageSubscriber.subscribe("video");
    this.itemSubscriber.subscribe("item");
  }

  buttons_display(btns, vid) {
    document.getElementById("camera-btn").style.display = btns;
    document.getElementById("vid1-btn").style.display = btns;
    document.getElementById("vid2-btn").style.display = btns;
    document.getElementById("logo").style.display = btns;

    document.getElementById("video").style.display = vid;
    document.getElementById("stop").style.display = vid;
  }

  subscribe(source) {
    this.buttons_display("none", "block");
    this.socket.send(source);

    this.receive_footage();
    this.receive_detection();
  }

  receive_footage() {
    this.footageSubscriber.on("message", function(topic, message) {
      const img = document.getElementById("video");
      img.src = `data:image/jpeg;base64,${message}`;
    });
  }

  receive_detection() {
    this.itemSubscriber.on("message", function(topic, message) {
      let array = Array.from(message);
    });
  }

  add_product(productArray) {}

  kill_video() {
    this.buttons_display("block", "none");

    this.requester.send("False");
  }
}
