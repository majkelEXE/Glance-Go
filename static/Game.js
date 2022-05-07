class Game {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0xffffff);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("root").append(this.renderer.domElement);

    this.render(); // wywołanie metody render
  }

  render = () => {
    requestAnimationFrame(this.render);
    this.renderer.render(this.scene, this.camera);
    console.log("render leci");
  };
}

export default Game;
