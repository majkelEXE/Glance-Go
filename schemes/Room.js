class Room {
    constructor(roomName, ownerClient){
        this.roomName = roomName,
        this.clients = [ownerClient],
        this.cards = []
    }

    addClient(client){
        this.clients.push(client)
    }
}

module.exports = Room