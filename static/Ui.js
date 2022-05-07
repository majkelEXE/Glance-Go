import { net } from "./Main.js";

class Ui {
  constructor() {
    document.getElementById("joinRoom").addEventListener("click", () => {
      var message = {
        type: "createJoinRoom",
        roomName: document.getElementById("roomNameInput").value,
        id: document.getElementById("nickInput").value,
      };
      net.sendMessage(message);
    });
  }
}

export default Ui;
