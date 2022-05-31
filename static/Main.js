import Game from "./Game.js";
import LobbyModel from "./LobbyModel.js";
import Net from "./Net.js";
import Ui from "./Ui.js";

let lobbyModel;
let game;
let net;
let ui;

window.onload = () => {
  //game = new Game();
  net = new Net();
  ui = new Ui();
  lobbyModel = new LobbyModel();
};

let initializeGame = () => {
  game = new Game();
};

export { net, ui, lobbyModel, game, initializeGame };
