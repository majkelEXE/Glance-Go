import LobbyModel from "./LobbyModel.js";
import Net from "./Net.js";
import Ui from "./Ui.js";

let lobbyModel;
let game;
let net;
let ui;

window.onload = () => {
  net = new Net();
  ui = new Ui();
  lobbyModel = new LobbyModel();
};

export { net, ui, lobbyModel, game };
