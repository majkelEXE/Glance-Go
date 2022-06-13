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
        numberOfSymbols: parseInt(
          document.getElementById("numberOfSymbols").innerHTML.slice(-1)
        ),
        collision: document.getElementById("collision").checked,
      };

      net.sendMessage(message);

      if (document.getElementById("startRoom").innerHTML == "Start") {
        document.getElementById("startRoom").innerHTML = "Stop";
      } else {
        document.getElementById("startRoom").innerHTML = "Start";
      }
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

    document.getElementById("configInput").addEventListener("input", (e) => {
      document.getElementById(
        "numberOfSymbols"
      ).innerHTML = `Symbols: ${e.target.value}`;
      document.getElementById("numberOfCards").innerHTML = `Cards: ${
        (e.target.value - 1) ** 2 + (e.target.value - 1) + 1
      }`;
    });

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
      usersListElement += `<p id="${
        player.clientName == net.player && "ownPlayer"
      }" class="${player.owner && "ownerPlayer"}"> ${
        player.clientName
      } <span class="${
        player.ready ? "readyPlayer" : "notReadyPlayer"
      } "></span></p>`;
    });

    document.getElementById("usersInRoomList").innerHTML = usersListElement;
  };

  //FOR TEST PURPOUSE
  startGame = () => {
    document.getElementById("manageRoomMenu").style.display = "none";
    document.querySelector("body").style.background = "none";

    cancelAnimationFrame(lobbyModel.id);
    document.getElementsByTagName(
      "body"
    )[0].innerHTML = `<div id='gameMenu'><div id='ownCard'></div><div id='gameInfo'><div id='usersContainer'><p>USERS</p><div id='users'></div></div><div id='cardsLeftContainer'><p>CARDS LEFT</p><div id='cardsLeft'></div></div><div id='coolDownContainer'><p>COOLDOWN</p><div id='coolDown'></div><div id='protectionCooldown'></div></div><div id="positionReset"><i class="fa-solid fa-arrow-rotate-right"></i></div></div></div><div id='root'></div>`;

    document.getElementById("positionReset").addEventListener("click", () => {
      function randomSpherePoint(x0, z0, radius) {
        var u = Math.random();
        var v = Math.random();
        var theta = 2 * Math.PI * u;
        var phi = Math.acos(2 * v - 1);
        var x = x0 + radius * Math.sin(phi) * Math.cos(theta);
        var z = z0 + radius * Math.sin(phi) * Math.sin(theta);
        return [x, 0, z];
      }

      game.ownPlayer.model.position.set(...randomSpherePoint(0, 0, 450));
    });

    initializeGame();
  };

  showGameInterface = () => {
    document.getElementById("gameMenu").style.display = "flex";
  };

  updateUserCardUI = (cards) => {
    document.getElementById("ownCard").innerHTML = "";

    cards.forEach((card) => {
      document.getElementById(
        "ownCard"
      ).innerHTML += `<img src="../assets/icons/${card}.png" alt="${card}" width="40px" height="auto"/>`;
    });
  };

  showCooldown = () => {
    document.getElementById("coolDown").style.display = "flex";
  };

  hideCooldown = () => {
    document.getElementById("coolDown").style.display = "none";
  };

  showProtection = () => {
    document.getElementById("protectionCooldown").style.display = "flex";
  };

  hideProtection = () => {
    document.getElementById("protectionCooldown").style.display = "none";
  };

  updateScoreBoard = (clients) => {
    let usersString = "";

    clients
      .sort((a, b) => b.points - a.points)
      .forEach((client) => {
        usersString += `<p>${client.clientName}: ${client.points}</p>`;
      });

    document.getElementById("users").innerHTML = usersString;

    document.getElementById("cardsLeft").innerHTML = game.cardsLeft;
  };

  showGameConfiguration = () => {
    document.getElementById("configurationContainer").style.display = "flex";
  };

  showFinalDialog = (userScores) => {
    cancelAnimationFrame(game.id);

    document.getElementsByTagName("body")[0].style.backgroundImage = `url(
      './../assets/background.png'
    )`;

    document.getElementsByTagName("body")[0].style.backgroundSize = "cover";

    document.getElementsByTagName("body")[0].innerHTML = `<div id="finalDialog">
    <h1 class="gameTitleMenu">GAME FINISHED!</h1>
    <div class="scoreDiv"></div>
    <div class="settingsDiv">
      <button id="createRoom" onclick="location.reload()">Graj ponownie!</button>
    </div>
    </div>`;

    console.log(userScores);

    userScores.forEach((userScore, i) => {
      console.log(userScore);
      console.log(userScore[0]);
      console.log(userScore[1]);
      document.querySelector(".scoreDiv").innerHTML += `
          <div class="playerScoreContainer">
            <div class="playerScoreContainerNick">${userScore[0]}</div>
            <div class="playerScoreContainerPoints">${userScore[1]}</div>
          </div>`;

      // if (i - 1 == userScore.length) {
      //   console.log("KONIEC");
      //   document.getElementsByTagName("body")[0].innerHTML += `</div></div>`;
      // }
    });

    // for (const score of userScores.entries()) {
    //   console.log(`${score[0]}: ${score[1]}`);
    //   document.getElementsByTagName("body")[0].innerHTML += `
    //     <div class="playerScoreContainer">
    //       <div class="playerScoreContainerNick">${score[0]}</div>
    //       <div class="playerScoreContainerPoints">${score[1]}</div>
    //     </div>`;
    // }
  };

  //TODO: There is a possibility to function for displaying alerts here, but i dont knwo if it has any sense.
}

export default Ui;
