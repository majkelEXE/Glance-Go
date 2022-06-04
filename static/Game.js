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
    this.camera.position.set(Math.sin(500), 200, Math.cos(-500));
    this.camera.lookAt(this.scene.position);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
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

    //
    this.goal = new THREE.Object3D();
    this.follow = new THREE.Object3D();

    this.keys = {
      a: false,
      s: false,
      d: false,
      w: false,
    };

    this.time = 0;
    this.newPosition = new THREE.Vector3();
    this.matrix = new THREE.Matrix4();

    this.stop = 1;
    this.DEGTORAD = 0.01745327;
    this.temp = new THREE.Vector3();
    this.dir = new THREE.Vector3();
    this.a = new THREE.Vector3();
    this.b = new THREE.Vector3();
    this.coronaSafetyDistance = 500;
    this.velocity = 0.0;
    this.speed = 0.0;

    //

    // this.moveUpDown = 0; // 0 - none, 1 - up, -1 - down
    // this.moveLeftRight = 0; // 0 - none, 1 - left, -1 - right
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.camera.updateProjectionMatrix();
    this.renderer.render(this.scene, this.camera);

    //console.log(this.ownPlayer);

    let delta = this.clock.getDelta();

    if (this.players.length > 0) {
      this.players.forEach((player) => {
        if (player.mixer) {
          player.mixer.update(delta);
        }
      });
    }

    if (this.ownPlayer != undefined) {
      //COLLISION

      //console.log(this.ownPlayer.model.rotation);

      if (this.ownPlayer.mixer) {
        this.ownPlayer.mixer.update(delta);
      }

      this.speed = 0.0;
      this.rotateSpeed = 0.0;

      if (this.keys.w) this.speed = 2;
      else if (this.keys.s) this.speed = -2;

      this.velocity += (this.speed - this.velocity) * 0.2;
      this.ownPlayer.model.translateZ(this.velocity);

      //
      if (this.keys.a) this.rotateSpeed = 0.04;
      else if (this.keys.d) this.rotateSpeed = -0.04;

      this.ownPlayer.model.rotateY(this.rotateSpeed);
      //

      this.a.lerp(this.ownPlayer.model.position, 2);
      this.b.copy(this.goal.position);

      this.dir.copy(this.a).sub(this.b).normalize();
      const dis = this.a.distanceTo(this.b) - this.coronaSafetyDistance;
      this.goal.position.addScaledVector(this.dir, dis);
      this.goal.position.lerp(this.temp, 0.3);
      this.temp.setFromMatrixPosition(this.follow.matrixWorld);

      this.camera.lookAt(this.ownPlayer.model.position);

      if (this.keys.w || this.keys.s || this.keys.a || this.keys.d) {
        this.ownPlayer.playRunningAnimation();

        this.message = {
          type: "updatePlayer",
          playerInfo: {
            playerName: net.player,
            requestedRoom: net.room,
            playerPosition: this.ownPlayer.model.position,
            rotateSpeed: this.rotateSpeed,
            animationState: "running",
          },
        };
        net.sendMessage(this.message);
      } else {
        if (this.ownPlayer.running) {
          this.ownPlayer.playRestingAnimation();

          this.message = {
            type: "updatePlayer",
            playerInfo: {
              playerName: net.player,
              requestedRoom: net.room,
              animationState: "resting",
            },
          };
          net.sendMessage(this.message);
        }
      }
    }
  };

  renderPlayers = (players) => {
    //TESTS

    const symbol = new Symbol("apricot");
    symbol.position.set(100, 0, 100);
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

          //
          self.ownPlayer.model.add(self.follow);
          self.goal.add(self.camera);
          self.follow.position.z = -self.coronaSafetyDistance;

          //
        } else {
          self.players.push(playerGame);
        }

        //self.camera.position.set(0, 0, 180);
        //self.camera.lookAt(self.scene.position);
      });

      // const playerGame = new Player(player.clientName, player.color);
    });

    this.render(); // wywołanie metody render
    this.playerController();
  };

  playerController = () => {
    window.addEventListener("keydown", (e) => {
      const key = e.code.replace("Key", "").toLowerCase();
      if (this.keys[key] !== undefined) this.keys[key] = true;
    });
    window.addEventListener("keyup", (e) => {
      const key = e.code.replace("Key", "").toLowerCase();
      if (this.keys[key] !== undefined) this.keys[key] = false;
    });
  };

  updateOtherPlayer = (playerData) => {
    let test = this.players;

    console.log(playerData);

    var playerToUpdate = test.filter((player) => {
      return player.name == playerData.playerName;
    })[0];

    // console.log(
    //   test.filter((player) => {
    //     return player.name == playerData.playerName;
    //   })[0]
    // );

    if (playerToUpdate != undefined) {
      switch (playerData.animationState) {
        case "running":
          playerToUpdate.playRunningAnimation();

          playerToUpdate.model.position.set(
            playerData.playerPosition.x,
            playerData.playerPosition.y,
            playerData.playerPosition.z
          );

          playerToUpdate.model.rotateY(playerData.rotateSpeed);
          break;
        case "resting":
          playerToUpdate.playRestingAnimation();
          break;
      }

      // (playerToUpdate.model.position.x = playerData.playerX),
      //   (playerToUpdate.model.position.y = playerData.playerY),
      //   (playerToUpdate.model.position.z = playerData.playerZ);
    }
  };
}

export default Game;
