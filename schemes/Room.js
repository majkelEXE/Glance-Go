class Room {
  constructor(roomName, ownerClient) {
    (this.roomName = roomName),
      (this.clients = [ownerClient]),
      (this.cards = []);
  }

  addClient(client) {
    this.clients.push(client);
  }

  getRefreshedClientsMessage() {
    return JSON.stringify({
      message: "refreshClients",
      roomClients: this.clients,
    });
  }
}

module.exports = Room;
