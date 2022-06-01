const ws = require("ws");
var express = require("express");
var app = express();
const PORT = 3000;
var path = require("path");
const mongoClient = require("mongodb").MongoClient;

var CardSetter = require("./scripts/CardSetter");
var Card = require("./schemes/Card");
var Client = require("./schemes/Client");
var Room = require("./schemes/Room");

//ZMIENNE Z DANYMI DYNAMICZNYMI
var rooms = [];
//

app.use(express.static("static"));

const server = app.listen(PORT, function () {
  console.log("http://localhost:" + PORT);
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/static/index.html"));
});

app.get("/test", function (req, res) {
  res.sendFile(path.join(__dirname + "/static/test.html"));
});

const wss = new ws.WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.send(JSON.stringify({ message: "connected" }));

  ws.on("message", function message(data, isBinary) {
    console.log("received: %s", data);

    data = JSON.parse(data);

    switch (data.type) {
      case "createRoom":
        if (
          rooms.filter((room) => room.roomName == data.roomName).length == 0
        ) {
          const roomCardSetter = new CardSetter();
          //let cardSet = roomCardSetter.renderCardSet();
          var ownerClient = new Client(data.clientName, ws, 0, 0, 0);
          var room = new Room(data.roomName, ownerClient);
          rooms.push(room);

          let refreshedClients = room.getRefreshedClientsMessage();

          ws.send(JSON.stringify({ message: "created" }));
          ws.send(refreshedClients);
        } else {
          ws.send(JSON.stringify({ message: "nameExist" }));
        }
        break;
      case "joinRoom":
        var requestedRoom = rooms.filter(
          (room) => room.roomName == data.roomName
        )[0];

        if (requestedRoom) {
          if (
            requestedRoom.clients.filter(
              (client) => client.clientName == data.clientName
            ).length == 0
          ) {
            requestedRoom.addClient(
              new Client(
                data.clientName,
                ws,
                50 * Math.sin(requestedRoom.clients.length),
                0,
                50 * Math.cos(requestedRoom.clients.length)
              )
            );
            let refreshData = requestedRoom.getRefreshedClientsMessage();
            ws.send(JSON.stringify({ message: "joined" }));
            wss.clients.forEach(function each(client) {
              if (client.readyState === ws.OPEN) {
                client.send(refreshData, { binary: isBinary });
              }
            });
          } else {
            ws.send(JSON.stringify({ message: "nickNameExist" }));
          }
        } else {
          ws.send(JSON.stringify({ message: "roomNotExist" }));
        }
        break;
      case "setReady":
        var requestedRoom = rooms.filter(
          (room) => room.roomName == data.roomName
        )[0];

        var requestedUser = requestedRoom.clients.filter(
          (client) => client.clientName == data.clientName
        )[0];

        if (requestedUser) {
          requestedUser.setReady(!requestedUser.ready);


          if (
            requestedRoom.clients.filter((client) => client.ready == false)
              .length == 0
          ) {
            let msg = JSON.stringify({
              message: "start",
              players: requestedRoom.clients,
            });

            wss.clients.forEach(function each(client) {
              if (client.readyState === ws.OPEN) {
                client.send(msg, { binary: isBinary });
              }
            });
          } else {
            let refreshData = requestedRoom.getRefreshedClientsMessage();

           
            wss.clients.forEach(function each(client) {
              if (client.readyState === ws.OPEN) {
                client.send(refreshData, { binary: isBinary });
              }
            });
          }

          // let refreshData = requestedRoom.getRefreshedClientsMessage();

          // //ws.send(JSON.stringify({ message: "joined" }));
          // wss.clients.forEach(function each(client) {
          //   if (client.readyState === ws.OPEN) {
          //     client.send(refreshData, { binary: isBinary });
          //   }
          // });

        }
        break;
      case "updatePlayer":
        data = JSON.stringify({
          message: "updatePlayer",
          playerInfo: data.playerInfo,
        });

        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(data, { binary: isBinary });
          }
        });
        break;
        case "leaveRoom":
          var requestedRoom = rooms.filter(
            (room) => room.roomName == data.roomName
          )[0];
  
          requestedRoom.removeClient(data.clientName)

          if(requestedRoom.clients.length > 0) {
            let refreshData = requestedRoom.getRefreshedClientsMessage();

            wss.clients.forEach(function each(client) {
              if (client.readyState === ws.OPEN) {
                client.send(refreshData, { binary: isBinary });
              }
            });
          }
          else {
            rooms = rooms.filter(room => room.roomName != data.roomName)
          }

          console.log(rooms)



          break;
    }
  });
});
