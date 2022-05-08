import { net } from "./Main.js";

class Ui {
  constructor() {
    document.getElementById("createRoom").addEventListener("click", () => {
      var message = {
        type: "createRoom",
        roomName: document.getElementById("roomNameInput").value,
        clientId: document.getElementById("nickInput").value,
      };
      net.sendMessage(message);
    });

    document.getElementById("joinRoom").addEventListener("click", () => {
      var message = {
        type: "joinRoom",
        roomName: document.getElementById("roomNameInput").value,
        clientId: document.getElementById("nickInput").value,
      };
      net.sendMessage(message);
    });
  }
}

export default Ui;
