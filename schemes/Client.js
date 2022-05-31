class Client {
  constructor(clientName, wsClient, startX, startY, startZ) {
    (this.clientName = clientName),
      (this.wsClient = wsClient),
      (this.ready = false);
    this.startX = startX;
    this.startY = startY;
    this.startZ = startZ;
  }

  setReady(value) {
    this.ready = value;
  }
}

module.exports = Client;
