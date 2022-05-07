class Net {
  constructor() {
    this.socket = new WebSocket("ws://192.168.0.106:3000");

    // Connection opened
    // this.socket.addEventListener("open", function (event) {
    //   this.send("Hello Server!");
    // });

    // Listen for messages
    this.socket.addEventListener("message", function (event) {
      console.log("Message from server ", event.data);
    });
  }

  sendMessage = (msg) => {
    this.socket.send(JSON.stringify(msg));
  };
}

export default Net;
