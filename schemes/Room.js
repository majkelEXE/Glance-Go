class Room {
  constructor(roomName, ownerClient) {
    (this.roomName = roomName),
      (this.clients = [ownerClient]),
      (this.cards = []);
    this.roundNumber = 0;
  }

  addClient(client) {
    this.clients.push(client);
  }

  removeClient(name) {
    this.clients = this.clients.filter((client) => client.clientName != name);
  }

  getRefreshedClientsMessage() {
    return JSON.stringify({
      message: "refreshClients",
      roomClients: this.clients,
    });
  }
}

module.exports = Room;
