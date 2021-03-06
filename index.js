const ws = require("ws");
var express = require("express");
var app = express();
const PORT = process.env.PORT || 3000;
var path = require("path");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
var url = process.env.MONGOURI;

var CardSetter = require("./scripts/cardSetter");
var Card = require("./schemes/Card");
var Client = require("./schemes/Client");
var Room = require("./schemes/Room");
var Owner = require("./schemes/Owner");

var defaultPlayersCoordinates = require("./data/defaultPlayersCoordinates.json");
var symbolsCoordinates = require("./data/symbolsCoordinates.json");

//ZMIENNE Z DANYMI DYNAMICZNYMI
var rooms = [];
let numberOfSymbols;
let collision;
//

app.use(express.static("static"));

const server = app.listen(PORT, function () {
  console.log("http://localhost:" + PORT);
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("GlanceAndGo");
    dbo.listCollections().toArray(function (err, collections) {
      if (collections.length == 0) {
        dbo.createCollection("history", function (err, res) {
          if (err) throw err;
          dbo.createCollection(
            "defaultPlayersCoordinates",
            function (err, res) {
              if (err) throw err;
              dbo.createCollection("symbolsCoordinates", function (err, res) {
                if (err) throw err;
                dbo
                  .collection("defaultPlayersCoordinates")
                  .insertMany(defaultPlayersCoordinates, function (err, res) {
                    if (err) throw err;
                    dbo
                      .collection("symbolsCoordinates")
                      .insertMany(symbolsCoordinates, function (err, res) {
                        if (err) throw err;
                        db.close();
                      });
                  });
              });
            }
          );
        });
      }
    });
  });
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
    //console.log("received: %s", data);

    data = JSON.parse(data);

    switch (data.type) {
      case "createRoom":
        if (
          rooms.filter((room) => room.roomName == data.roomName).length == 0
        ) {
          //let cardSet = roomCardSetter.renderCardSet();
          var ownerClient = new Owner(data.clientName, ws);
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
          if (requestedRoom.isStarted) {
            ws.send(JSON.stringify({ message: "roomAlreadyStarted" }));
          } else {
            if (
              requestedRoom.clients.filter(
                (client) => client.clientName == data.clientName
              ).length == 0
            ) {
              requestedRoom.addClient(new Client(data.clientName, ws));
              let refreshData = requestedRoom.getRefreshedClientsMessage();
              ws.send(JSON.stringify({ message: "joined" }));

              requestedRoom.clients.forEach((client) => {
                if (client.wsClient.readyState === ws.OPEN) {
                  client.wsClient.send(refreshData, { binary: isBinary });
                }
              });
            } else {
              ws.send(JSON.stringify({ message: "nickNameExist" }));
            }
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

        if (requestedUser.owner) {
          numberOfSymbols = data.numberOfSymbols;
          collision = data.collision;
        }

        if (requestedUser) {
          requestedUser.setReady(!requestedUser.ready);
          requestedUser.setColor(data.color);

          //console.log(requestedUser);

          if (
            requestedRoom.clients.filter((client) => client.ready == false)
              .length == 0
          ) {
            requestedRoom.isStarted = true;
            //console.log(requestedRoom.clients.length.toString()); //karta z tym indeksem to mainCard

            const roomCardSetter = new CardSetter();
            requestedRoom.cards = roomCardSetter.renderCardSet(numberOfSymbols);

            //console.log(requestedRoom);

            MongoClient.connect(url, function (err, db) {
              if (err) throw err;
              var dbo = db.db("GlanceAndGo");
              dbo
                .collection("defaultPlayersCoordinates")
                .findOne(
                  { numberOfPlayers: requestedRoom.clients.length.toString() },
                  function (err, result) {
                    if (err) throw err;

                    dbo
                      .collection("symbolsCoordinates")
                      .findOne(
                        { numberOfSymbols: numberOfSymbols },
                        (err, res) => {
                          // console.log(res);
                          if (err) throw err;

                          //console.log(symbolsCoordinates);
                          var startCards = [];

                          requestedRoom.clients.forEach((client, i) => {
                            client.setPosition(result.coordinates[i]);
                            startCards.push(requestedRoom.cards[i]);
                          });

                          let mainCard =
                            requestedRoom.cards[requestedRoom.clients.length];

                          let msg = JSON.stringify({
                            message: "start",
                            players: requestedRoom.clients,
                            symbolsCoordinates: res.symbolsData,
                            mainCard: mainCard,
                            roundNumber: requestedRoom.roundNumber,
                            cardsLeft:
                              requestedRoom.cards.length -
                              requestedRoom.clients.length,
                            collision,
                          });

                          requestedRoom.clients.forEach((client, i) => {
                            msg = JSON.parse(msg);
                            msg["ownCard"] = startCards[i];
                            msg = JSON.stringify(msg);

                            if (client.wsClient.readyState === ws.OPEN) {
                              client.wsClient.send(msg, {
                                binary: isBinary,
                              });
                            }
                          });

                          requestedRoom.cards.splice(
                            0,
                            requestedRoom.clients.length + 1
                          );
                          //

                          db.close();
                        }
                      );
                  }
                );
            });
          } else {
            let refreshData = requestedRoom.getRefreshedClientsMessage();

            requestedRoom.clients.forEach((client) => {
              if (client.wsClient.readyState === ws.OPEN) {
                client.wsClient.send(refreshData, { binary: isBinary });
              }
            });
          }
        }
        break;
      case "updatePlayer":
        // console.log(data.playerInfo);
        var requestedRoom = rooms.filter((room) => {
          return room.roomName == data.playerInfo.requestedRoom;
        })[0];
        // console.log(requestedRoom);

        if (requestedRoom) {
          data = JSON.stringify({
            message: "updatePlayer",
            playerInfo: data.playerInfo,
          });

          requestedRoom.clients.forEach((client) => {
            if (
              client.wsClient.readyState === ws.OPEN &&
              client.wsClient !== ws
            ) {
              client.wsClient.send(data, { binary: isBinary });
            }
          });
        }

        break;
      case "leaveRoom":
        var requestedRoom = rooms.filter(
          (room) => room.roomName == data.roomName
        )[0];

        if (requestedRoom) {
          requestedRoom.removeClient(data.clientName);

          if (requestedRoom.clients.length > 0) {
            let refreshData = requestedRoom.getRefreshedClientsMessage();

            requestedRoom.clients.forEach((client) => {
              if (client.wsClient.readyState === ws.OPEN) {
                client.wsClient.send(refreshData, { binary: isBinary });
              }
            });
          } else {
            rooms = rooms.filter((room) => room.roomName != data.roomName);
          }
        }

        break;
      case "scoredPoint":
        var requestedRoom = rooms.filter(
          (room) => room.roomName == data.roomName
        )[0];
        if (requestedRoom) {
          requestedRoom.clients.forEach((client) => {
            if (client.clientName == data.playerName) {
              client.points += 1;
              return;
            }
          });

          if (requestedRoom.cards.length > 0) {
            ws.send(JSON.stringify({ message: "pointScored" }));

            requestedRoom.roundNumber += 1;

            data = JSON.stringify({
              message: "updateMainCard",
              mainCard: requestedRoom.cards[0],
              roundNumber: requestedRoom.roundNumber,
              cardsLeft: requestedRoom.cards.length,
              clients: requestedRoom.clients.map((client) => {
                return {
                  clientName: client.clientName,
                  points: client.points,
                };
              }),
            });
            requestedRoom.cards.splice(0, 1);

            requestedRoom.clients.forEach((client) => {
              if (client.wsClient.readyState === ws.OPEN) {
                client.wsClient.send(data, { binary: isBinary });
              }
            });
          } else {
            var userScoresSever = new Map();

            requestedRoom.clients.forEach((client) => {
              userScoresSever.set(client.clientName, client.points);
            });

            userScoresSever = new Map(
              [...userScoresSever].sort((a, b) => b[1] - a[1])
            );
            //console.log(userScoresSever);

            data = JSON.stringify({
              message: "gameFinished",
              userScores: Array.from(userScoresSever.entries()),
            });

            requestedRoom.clients.forEach((client) => {
              if (client.wsClient.readyState === ws.OPEN) {
                client.wsClient.send(data, { binary: isBinary });
              }
            });

            saveGame({
              name: requestedRoom.roomName,
              date: new Date().toLocaleString(),
              userScores: Array.from(userScoresSever.entries()),
            });

            rooms = rooms.filter((room) => {
              return room.roomName != requestedRoom.roomName;
            });
          }
        }

        break;
    }
  });
});

function saveGame(gameData) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("GlanceAndGo");
    dbo.collection("history").insert(gameData, function (err, result) {
      if (err) throw err;

      dbo
        .collection("symbolsCoordinates")
        .findOne({ numberOfSymbols: numberOfSymbols }, (err, res) => {
          // console.log(res);
          if (err) throw err;

          db.close();
        });
    });
  });
}
function getGamesHistory(res) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;

    var dbo = db.db("GlanceAndGo");
    dbo
      .collection("history")
      .find()
      .toArray(function (err, items) {
        if (err) console.log(err);

        res.send(items);
      });
  });
}

app.get("/getHistory", async (req, res) => {
  getGamesHistory(res);
});

app.get("/history", async (req, res) => {
  res.sendFile(__dirname + "/static/history.html");
});

app.get("/instructions", async (req, res) => {
  res.sendFile(__dirname + "/static/instructions.html");
});

//test
//tewst2
