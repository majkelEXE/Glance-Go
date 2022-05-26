class Client {
  constructor(clientName, wsClient) {
    (this.clientName = clientName),
      (this.wsClient = wsClient),
      (this.ready = false);
  }

  setReady(value) {
    this.ready = value;
  }
}

module.exports = Client;
