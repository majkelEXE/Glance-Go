export default class Symbol extends THREE.Mesh {
  constructor(symbol) {
    super(new THREE.CylinderGeometry(50, 50, 10, 64));
    this.loader = new THREE.TextureLoader();
    this.radius = 25;

    this.loader.load(`./../assets/icons/${symbol}.png`, (texture) => {
      this.material = [
        new THREE.MeshPhongMaterial({
          color: 0xffffff,
        }),
        new THREE.MeshPhongMaterial({
          map: texture,
          transparent: true,
        }),
      ];
      console.log(this);
    });
  }
}
