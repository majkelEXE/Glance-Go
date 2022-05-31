export default class Player extends THREE.Mesh {
  constructor(name) {
    super(); // wywołanie konstruktora klasy z której dziedziczymy czyli z Mesha
    this.geometry = new THREE.BoxGeometry(20, 20, 20);
    this.material = new THREE.MeshBasicMaterial({ color: 0xff0fff });
    this.name = name;
    console.log(this);
  }
}

// const pionek = new Player();
