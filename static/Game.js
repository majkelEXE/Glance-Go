import Player from "./gameComponents/Player.js";
import RoomModel from "./gameComponents/RoomModel.js";
import Symbol from "./gameComponents/Symbol.js";
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
    this.camera.position.set(0, 1000, 750);
    this.camera.lookAt(this.scene.position);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0x000000);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("root").append(this.renderer.domElement);

    const axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(axesHelper);

    const axesHelper2 = new THREE.AxesHelper(-1000);
    this.scene.add(axesHelper2);

    this.ownPlayer = undefined;
    this.players = [];

    this.scene.add(new RoomModel());

    this.clock = new THREE.Clock();

    this.render(); // wywołanie metody render
    this.moveUpDown = 0; // 0 - none, 1 - up, -1 - down
    this.moveLeftRight = 0; // 0 - none, 1 - left, -1 - right
    this.playerController();
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);

    let delta = this.clock.getDelta();

    this.players.forEach((player) => {
      if (player.mixer) {
        player.mixer.update(delta);
      }
    });

    if (this.ownPlayer != undefined) {
      if (this.ownPlayer.mixer) {
        this.ownPlayer.mixer.update(delta);
      }

      this.ownPlayer.model.position.x += this.moveUpDown * 1;
      this.ownPlayer.model.position.z += this.moveLeftRight * 1;

      if (this.moveUpDown != 0 || this.moveLeftRight != 0) {
        var message = {
          type: "updatePlayer",
          playerInfo: {
            playerName: net.player,
            requestedRoom: net.room,
            playerX: this.ownPlayer.model.position.x,
            playerY: this.ownPlayer.model.position.y,
            playerZ: this.ownPlayer.model.position.z,
          },
        };

        net.sendMessage(message);
      } else {
        if (this.ownPlayer.animating) {
          this.ownPlayer.playRestingAnimation();
        }
      }
    }
  };

  renderPlayers = (players) => {
    //TESTS

    const symbol = new Symbol("apricot");
    this.scene.add(symbol);

    //******************

    //CONFIGURE LIGHT
    const light = new THREE.HemisphereLight(0xffffff, 0x757575, 1);
    this.scene.add(light);

    players.forEach((player) => {
      let self = this;
      const loader = new THREE.FBXLoader();

      loader.load("./assets/models/source/player.fbx", function (object) {
        console.log(object);

        // object.scale.set(0.5, 0.5, 0.5);
        // object.position.y = -50;

        // object.traverse(function (child) {
        //   // dla kazdego mesha w modelu
        //   if (child.isMesh) {
        //     child.material.shininess = 2;
        //     child.material.map = null;
        //     child.material.color.setStyle("#00ff00");
        //     child.material.needsUpdate = true;
        //     self.configurationModel = child;
        //   }
        // });

        //ADDING MODEL

        let playerGame = new Player(player.clientName, player.color, object);
        self.scene.add(playerGame.model);
        playerGame.model.position.set(
          player.startX,
          player.startY,
          player.startZ
        );
        if (player.clientName == net.player) {
          self.ownPlayer = playerGame;
        } else {
          self.players.push(playerGame);
        }

        //self.camera.position.set(0, 0, 180);
        //self.camera.lookAt(self.scene.position);
      });

      // const playerGame = new Player(player.clientName, player.color);
    });
  };

  playerController = () => {
    window.addEventListener("keydown", (e) => {
      this.ownPlayer.playRunningAnimation();

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

    if (playerToUpdate != undefined) {
      (playerToUpdate.model.position.x = playerData.playerX),
        (playerToUpdate.model.position.y = playerData.playerY),
        (playerToUpdate.model.position.z = playerData.playerZ);
      playerToUpdate.playRunningAnimation();
    }
  };
}

export default Game;
