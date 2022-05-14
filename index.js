const ws = require("ws");
var express = require("express");
var app = express();
const PORT = 3000;
var path = require("path");
const mongoClient = require("mongodb").MongoClient;
var _db;
var coll_rooms;
var CardSetter = require("./scripts/CardSetter");

app.use(express.static("static"));

const server = app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/static/index.html"));
});

mongoClient.connect("mongodb://localhost/GlanceAndGo", function (err, db) {
  if (err) console.log(err);
  else console.log("mongo podłączone!"); //tu można operować na utworzonej bazie danych db lub podstawić jej obiekt // pod zmienną widoczną na zewnątrz
  _db = db;
  db.createCollection("rooms", function (err, coll) {
    console.log("kolekcja powstała, sprawdź efekt w konsoli klienta mongo");
    coll_rooms = coll;
  });
});

const wss = new ws.WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.send(JSON.stringify({ message: "connected" }));

  ws.on("message", function message(data, isBinary) {
    console.log("received: %s", data);

    data = JSON.parse(data);

    switch (data.type) {
      case "createRoom":
        const roomCardSetter = new CardSetter();
        let cardSet = roomCardSetter.renderCardSet();

        var room = {
          _id: data.roomName,
          roomOwner: data.clientId,
          clients: [{ clientId: data.clientId, client: ws }],
          cards: cardSet,
        };

        coll_rooms.insertOne(room, function (err, res) {
          if (err) {
            ws.send(JSON.stringify({ message: "nameExist" }));
            //throw err;
          } else {
            ws.send(JSON.stringify({ message: "created" }));
          }
        });

        break;
      case "joinRoom":
        coll_rooms.findOne({ _id: data.roomName }, function (err, result) {
          if (!err && result != null) {
            console.log(result);
            //checking if in room is user with this nickname and insert it
            if (
              !result.clients.some((client) => client.clientId == data.clientId)
            ) {
              var allClients = [
                ...result.clients,
                { clientId: data.clientId, client: ws },
              ];

              var updatedClients = {
                $set: {
                  clients: allClients,
                },
              };
              coll_rooms.updateOne(
                { _id: result._id },
                updatedClients,
                function (err, resultUpdated) {
                  if (!err) {
                    ws.send(JSON.stringify({ message: "joined" }));
                    allClients.forEach((client) => {
                      if (client.client.readyState === ws.OPEN) {
                        // client.client.send(
                        //   JSON.stringify({
                        //     message: "updateUsersQueue",
                        //     users: resultUpdated.clients,
                        //   }),
                        //   {
                        //     binary: isBinary,
                        //   }
                        // );
                        client.client.send(JSON.stringify({ message: "ej" }));
                      }
                    });
                  }
                }
              );
            } else {
              ws.send(JSON.stringify({ message: "nickNameExist" }));
            }
          } else {
            ws.send(JSON.stringify({ message: "roomNotExist" }));
          }
        });
        break;
    }

    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(data), { binary: isBinary });
      }
    });
  });
});
