import { net } from "./Main.js";

class Ui {
  constructor() {
    document.getElementById("createRoom").addEventListener("click", () => {
      var message = {
        type: "createRoom",
        roomName: document.getElementById("roomNameInput").value,
        clientName: document.getElementById("nickInput").value,
      };
      net.sendMessage(message);
    });

    document.getElementById("joinRoom").addEventListener("click", () => {
      var message = {
        type: "joinRoom",
        roomName: document.getElementById("roomNameInput").value,
        clientName: document.getElementById("nickInput").value,
      };
      net.sendMessage(message);
    });
  }

  showQueue = () => {
    document.getElementById("joinRoomMenu").style.display = "none";
    document.getElementById("manageRoomMenu").style.display = "block";
  };

  //TODO: There is a possibility to function for displaying alerts here, but i dont knwo if it has any sense.
}

export default Ui;
