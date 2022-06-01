import Game from "./Game.js";
import LobbyModel from "./LobbyModel.js";
import { game, initializeGame, lobbyModel, net } from "./Main.js";

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
        color: document.getElementById("modelColor").value,
      };

      net.sendMessage(message);
    });
  }

  showLobby = () => {
    document.getElementById("joinRoomMenu").style.display = "none";
    document.getElementById("manageRoomMenu").style.display = "flex";

    document.getElementById("modelColor").addEventListener("input", (e) => {
      lobbyModel.changeConfigurationModelColor(e.target.value);
    });

    // document.getElementById("test").addEventListener("click", () => {

    // });

    window.addEventListener("beforeunload", function (e) {
      var message = {
        type: "leaveRoom",
        roomName: net.room,
        clientName: net.player,
      };

      net.sendMessage(message);
    });

    lobbyModel.resize(
      document.getElementById("root").offsetWidth,
      document.getElementById("root").offsetHeight
    );

    lobbyModel.addConfigurationModel();
  };

  // showGame = () => {
  //   document.getElementById("manageRoomMenu").style.display = "none";
  //   document.querySelector("body").style.background = "none";
  //   document.getElementById("root").style.display = "flex";
  // };

  updateUserList = (players) => {
    let usersListElement = "";

    players.forEach((player) => {
      usersListElement += `<p>${player.clientName} <span class="${
        player.ready ? "readyPlayer" : "notReadyPlayer"
      }"></span></p>`;
    });

    document.getElementById("usersInRoomList").innerHTML = usersListElement;
  };

  //FOR TEST PURPOUSE
  startGame = () => {
    document.getElementById("manageRoomMenu").style.display = "none";
    document.querySelector("body").style.background = "none";

    cancelAnimationFrame(lobbyModel.id);
    document.getElementsByTagName("body")[0].innerHTML =
      "<div id='root'></div>";

    initializeGame();
  };

  //TODO: There is a possibility to function for displaying alerts here, but i dont knwo if it has any sense.
}

export default Ui;
