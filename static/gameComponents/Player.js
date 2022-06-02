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
  }
}