class LobbyModel {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, 0, 0.1, 10000);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setSize(0, 0);
    this.id;

    document.getElementById("root").append(this.renderer.domElement);

    this.clock = new THREE.Clock();
    this.mixer = null;
    this.configurationModel = null;

    this.render(); // wywołanie metody render
  }

  addConfigurationModel = () => {
    //CONFIGURE LIGHT
    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);

    let self = this;
    const loader = new THREE.FBXLoader();

    loader.load("./assets/models/source/player.fbx", function (object) {
      self.mixer = new THREE.AnimationMixer(object);

      const action = self.mixer.clipAction(object.animations[1]);
      action.play();

      object.scale.set(0.5, 0.5, 0.5);
      object.position.y = -50;

      object.traverse(function (child) {
        // dla kazdego mesha w modelu
        if (child.isMesh) {
          child.material.shininess = 2;
          child.material.map = null;
          child.material.color.setStyle("#ccae2b");
          child.material.needsUpdate = true;
          self.configurationModel = child;
        }
      });

      //ADDING MODEL
      self.scene.add(object);
      self.camera.position.set(0, 0, 180);
      self.camera.lookAt(self.scene.position);
    });
  };

  changeConfigurationModelColor = (color) => {
    this.configurationModel.material.color.setStyle(color);
  };

  resize = (width, height) => {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    this.camera.position.set(100, 100, 100);
    this.camera.lookAt(this.scene.position);
  };

  render = () => {
    this.id = requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);

    let delta = this.clock.getDelta();
    if (this.mixer) {
      this.mixer.update(delta);
    }

    console.log("render leci lobby");
  };
}

export default LobbyModel;
