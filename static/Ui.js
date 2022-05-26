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

    document.getElementById("startRoom").addEventListener("click", () => {
      var message = {
        type: "setReady",
        roomName: net.room,
        clientName: net.player,
      };

      net.sendMessage(message);
    });
  }

  showLobby = () => {
    document.getElementById("joinRoomMenu").style.display = "none";
    document.getElementById("manageRoomMenu").style.display = "flex";
  };

  updateUserList = (players) => {
    let usersListElement = "";

    players.forEach((player) => {
      usersListElement += `<p>${player.clientName} <span class="${
        player.ready ? "readyPlayer" : "notReadyPlayer"
      }"></span></p>`;
    });

    console.log(usersListElement, document.getElementById("usersInRoomList"));

    document.getElementById("usersInRoomList").innerHTML = usersListElement;
  };

  //TODO: There is a possibility to function for displaying alerts here, but i dont knwo if it has any sense.
}

export default Ui;
