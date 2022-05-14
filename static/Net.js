import { ui } from "./Main.js";

class Net {
  constructor() {
    this.socket = new WebSocket("ws://192.168.0.106:3000");

    // Connection opened
    // this.socket.addEventListener("open", function (event) {
    //   this.send("Hello Server!");
    // });

    // Listen for messages
    this.socket.addEventListener("message", function (event) {
      let respond = JSON.parse(event.data);

      console.log(respond);

      switch (respond.message) {
        case "nameExist":
          alert(
            "This room name is already used. You need to create different."
          );
          break;
        case "roomNotExist":
          alert(
            "There isnt any room with similar name. Please create your own room or check spelling."
          );
          break;
        case "nickNameExist":
          alert(
            "There is an user with this nick name. Please change it to something different."
          );
          break;
        case "created":
        case "joined":
          ui.showQueue();
          break;
      }

      //case on createdRoom

      //case on joinedToRoom
    });
  }

  sendMessage = (msg) => {
    this.socket.send(JSON.stringify(msg));
  };
}

export default Net;
