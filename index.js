const ws = require("ws");
var express = require("express");
var app = express();
const PORT = 3000;
var path = require("path");

app.use(express.static("static"));

const server = app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/static/index.html"));
});

const wss = new ws.WebSocketServer({ server });

wss.on("connection", function connection(ws) {
  ws.send("You are connected to server");

  ws.on("message", function message(data, isBinary) {
    console.log("received: %s", data);

    wss.clients.forEach(function each(client) {
      if (client.readyState === ws.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
