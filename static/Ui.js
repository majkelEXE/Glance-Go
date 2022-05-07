import { net } from "./Main.js";

class Ui {
  constructor() {
    document.getElementById("testButton").addEventListener("click", () => {
      net.socket.send("Wiadomosc ode mnie");
      //console.log(net);
    });
  }
}

export default Ui;
