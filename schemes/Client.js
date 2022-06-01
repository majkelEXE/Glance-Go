class Client {
  constructor(clientName, wsClient, startX, startY, startZ) {
    (this.clientName = clientName),
      (this.wsClient = wsClient),
      (this.ready = false);
    this.color = "#00ff00";
    this.startX = startX;
    this.startY = startY;
    this.startZ = startZ;
  }

  setReady(value) {
    this.ready = value;
  }

  setColor(color) {
    this.color = color;
  }
}

module.exports = Client;
