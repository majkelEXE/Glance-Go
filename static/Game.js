import Player from "./gameComponents/Player.js";
import { net } from "./Main.js";

class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(600, 300, 600);
    this.camera.lookAt(this.scene.position);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0xffffff);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("root").append(this.renderer.domElement);

    const axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(axesHelper);

    const axesHelper2 = new THREE.AxesHelper(-1000);
    this.scene.add(axesHelper2);

    this.ownPlayer = undefined;
    this.players = [];

    this.render(); // wywołanie metody render
    this.moveUpDown = 0; // 0 - none, 1 - up, -1 - down
    this.moveLeftRight = 0; // 0 - none, 1 - left, -1 - right
    this.playerController();
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);

    if (this.ownPlayer != undefined) {
      this.ownPlayer.position.x += this.moveUpDown * 1;
      this.ownPlayer.position.z += this.moveLeftRight * 1;
      if (this.moveUpDown != 0 || this.moveLeftRight != 0) {
        var message = {
          type: "updatePlayer",
          playerInfo: {
            playerX: this.ownPlayer.position.x,
            playerY: this.ownPlayer.position.y,
            playerZ: this.ownPlayer.position.z,
            playerName: net.player,
          },
        };

        net.sendMessage(message);
      }
    }
  };

  renderPlayers = (players) => {
    players.forEach((player) => {
      const playerGame = new Player(player.clientName);
      this.scene.add(playerGame);
      playerGame.position.set(player.startX, player.startY, player.startZ);
      if (player.clientName == net.player) {
        this.ownPlayer = playerGame;
      } else {
        this.players.push(playerGame);
      }
    });
  };

  playerController = () => {
    window.addEventListener("keydown", (e) => {
      switch (e.which) {
        //arrow up
        case 38:
          this.moveUpDown = 1;
          break;
        //arrow down
        case 40:
          this.moveUpDown = -1;
          break;
        //arrow left
        case 37:
          this.moveLeftRight = 1;
          break;
        //arrow right
        case 39:
          this.moveLeftRight = -1;
          break;
      }
    });

    window.addEventListener("keyup", (e) => {
      switch (e.which) {
        //arrow up
        case 38:
        case 40:
          this.moveUpDown = 0;
          break;
        //arrow left
        case 37:
        case 39:
          this.moveLeftRight = 0;
          break;
      }
    });
  };

  updateOtherPlayer = (playerData) => {
    let test = this.players;

    var playerToUpdate = test.filter((player) => {
      return player.name == playerData.playerName;
    })[0];

    console.log(
      test.filter((player) => {
        return player.name == playerData.playerName;
      })
    );

    if (playerToUpdate != undefined) {
      (playerToUpdate.position.x = playerData.playerX),
        (playerToUpdate.position.y = playerData.playerY),
        (playerToUpdate.position.z = playerData.playerZ);
    }
  };
}

export default Game;
