export default class Player extends THREE.Mesh {
  constructor(name, color) {
    super(); // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
    this.geometry = new THREE.BoxGeometry(20, 20, 20);
    this.material = new THREE.MeshBasicMaterial({ color });
    this.name = name;
    console.log(this);
  }
}

// const pionek = new Player();
