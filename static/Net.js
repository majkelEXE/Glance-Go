import { ui } from "./Main.js";

class Net {
  constructor() {
    this.socket = new WebSocket("ws://localhost:3000");
    this.players = [];
    this.player = null;
    this.room = null;

    // Connection opened
    // this.socket.addEventListener("open", function (event) {
    //   this.send("Hello Server!");
    // });

    // Listen for messages
    this.initialize();
  }

  initialize = () => {
    const setPlayers = (value) => {
      this.players = value;
    };

    const getPlayers = () => {
      return this.players;
    };

    const setPlayer = (value) => {
      this.player = value;
    };

    const setRoom = (value) => {
      this.room = value;
    };

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
          setPlayer(document.getElementById("nickInput").value);
          setRoom(document.getElementById("roomNameInput").value);
          console.log(this);
          ui.showLobby();
          break;
        case "refreshClients":
          console.log(respond.roomClients);
          setPlayers(respond.roomClients);
          ui.updateUserList(getPlayers());
          break;
      }

      //case on createdRoom

      //case on joinedToRoom
    });
  };

  sendMessage = (msg) => {
    this.socket.send(JSON.stringify(msg));
  };
}

export default Net;
