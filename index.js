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
  ws.send("You are connected to server");

  ws.on("message", function message(data, isBinary) {
    console.log("received: %s", data);

    data = JSON.parse(data);

    switch (data.type) {
      case "createJoinRoom":
        const roomCardSetter = new CardSetter();
        let cardSet = roomCardSetter.renderCardSet();
        console.log(cardSet);

        break;
    }

    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify(data), { binary: isBinary });
      }
    });
  });
});
