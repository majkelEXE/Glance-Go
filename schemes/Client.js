class Client {
  constructor(clientName, wsClient) {
    (this.clientName = clientName),
      (this.wsClient = wsClient),
      (this.ready = false);
    this.color = "#00ff00";
    this.points = 0;
  }

  setReady(value) {
    this.ready = value;
  }

  setColor(color) {
    this.color = color;
  }

  setPosition(obj) {
    this.startX = obj.startX;
    this.startY = obj.startY;
    this.startZ = obj.startZ;
  }
}

module.exports = Client;
