var Client = require("./Client");

class Owner extends Client {
  constructor(clientName, wsClient) {
    super(clientName, wsClient);
    this.owner = true;
  }
}

module.exports = Owner;
