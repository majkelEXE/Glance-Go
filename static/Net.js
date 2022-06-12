import { ui, game } from "./Main.js";

class Net {
  constructor() {
    this.socket = new WebSocket(
      "ws" + window.location.href.slice(window.location.href.indexOf(":"))
    );
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

    const getPlayer = () => {
      return this.player;
    };

    const setRoom = (value) => {
      this.room = value;
    };

    this.socket.addEventListener("message", function (event) {
      let respond = JSON.parse(event.data);

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
        case "roomAlreadyStarted":
          alert("The room you try to join is already started.");
          break;
        case "created":
        case "joined":
          setPlayer(document.getElementById("nickInput").value);
          setRoom(document.getElementById("roomNameInput").value);
          ui.showLobby();
          break;
        case "refreshClients":
          setPlayers(respond.roomClients);
          if (
            respond.roomClients.filter((client) => client.owner)[0]
              .clientName == getPlayer()
          ) {
            ui.showGameConfiguration();
          }
          ui.updateUserList(getPlayers());
          break;
        case "start":
          ui.startGame();
          ui.showGameInterface();
          game.ownCard = respond.ownCard;
          game.mainCard = respond.mainCard;
          game.roundNumber = respond.roundNumber;
          game.cardsLeft = respond.cardsLeft;
          ui.updateUserCardUI(respond.ownCard);
          game.renderSymbols(respond.symbolsCoordinates, respond.mainCard);
          game.renderPlayers(respond.players);
          ui.updateScoreBoard(respond.players);
          break;
        case "updatePlayer":
          game.updateOtherPlayer(respond.playerInfo);
          break;
        case "pointScored":
          console.log("NET SCORED");
          ui.updateUserCardUI(game.mainCard);
          game.ownCard = game.mainCard;
          break;
        case "updateMainCard":
          console.log("NET CARDS UPDATE");
          game.mainCard = respond.mainCard;
          game.roundNumber = respond.roundNumber;
          game.cardsLeft = respond.cardsLeft;
          game.updateSymbols(respond.mainCard);
          ui.updateScoreBoard(respond.clients);
          break;
        case "gameFinished":
          console.log(respond);
          ui.showFinalDialog(respond.userScores);
          // alert("GRA SKONCZONA!11!!111");
          // location.reload();
          break;
      }
    });
  };

  sendMessage = (msg) => {
    this.socket.send(JSON.stringify(msg));
  };
}

export default Net;
