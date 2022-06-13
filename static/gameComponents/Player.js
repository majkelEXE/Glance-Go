// export default class Player extends THREE.Mesh {
//   constructor(name, color) {
//     super(); // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
//     this.geometry = new THREE.BoxGeometry(20, 20, 20);
//     this.material = new THREE.MeshBasicMaterial({ color });
//     this.name = name;
//     console.log(this);
//   }
// }

// const pionek = new Player();

import { game, ui } from "./../Main.js";

export default class Player {
  constructor(name, color, model) {
    this.name = name;
    this.color = color;
    this.model = model;

    this.model.scale.set(0.5, 0.5, 0.5);

    this.model.traverse(function (child) {
      if (child.isMesh) {
        child.material.shininess = 2;
        child.material.map = null;
        child.material.color.setStyle(color);
        child.material.needsUpdate = true;
      }
    });
    this.loader = new THREE.FontLoader();

    this.loader.load("./../assets/Russo.json", (font) => {
      const geometry = new THREE.TextGeometry(this.name, {
        font: font,
        size: 20,
        height: 2,
      });

      const text = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color: this.color })
      );

      text.geometry.center();

      text.position.y += 220;
      text.position.z -= 20;

      this.model.add(text);
    });

    console.log(this.model);
    // this.model.add(
    //   new THREE.Mesh(
    //     new THREE.TextGeometry("DUPA", {
    //       size: 50,
    //       height: 10,
    //       curveSegments: 12,

    //       bevelThickness: 1,
    //       bevelSize: 1,
    //       bevelEnabled: true,
    //     }),
    //     new THREE.MeshPhongMaterial({ color: 0x00ffff })
    //   )
    // );

    this.mixer = new THREE.AnimationMixer(this.model);
    this.running = true;

    this.lastPositon = null;

    this.cooledDown = true;
    this.coolDownTimeout = null;

    this.coolDownProtected = false;
    this.coolDownProtectionTimeout = null;

    console.log(this);

    this.playRestingAnimation();
  }

  playRunningAnimation = () => {
    if (!this.running) {
      // console.log("PLAYING RUNNING");
      this.mixer.stopAllAction();
      this.mixer.clipAction(this.model.animations[0]).play();

      this.running = true;
    }
  };

  playRestingAnimation = () => {
    if (this.running) {
      // console.log("STOPPING RUNNING");
      this.mixer.stopAllAction();
      this.mixer.clipAction(this.model.animations[2]).play();

      this.running = false;
    }
  };

  startCooldown = () => {
    this.cooledDown = false;

    ui.showCooldown();

    this.coolDownTimeout = setTimeout(() => {
      console.log("COOLED");
      this.cooledDown = true;
      ui.hideCooldown();
    }, 5000);
  };

  startCooldownProtection = () => {
    this.coolDownProtected = true;

    ui.showProtection();

    this.coolDownProtectionTimeout = setTimeout(() => {
      // console.log("PROTECTION EXPIRED");
      this.coolDownProtected = false;
      ui.hideProtection();
    }, 3000);
  };
}
