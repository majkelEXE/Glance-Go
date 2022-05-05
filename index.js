var express = require("express");
var app = express();
const PORT = 3000;

app.get("/", function (req, res) {
  res.send("dane html odesłane z serwera do przeglądarki");
});

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});
