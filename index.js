var express = require("express");
var app = express();

app.use(express.static(__dirname + "/public"));

app.listen(8000, function () {
    console.log("App is ready");
});

var suggestions = require("./server/routers/suggestions");

app.use("/suggestions", suggestions);

GLOBAL.express = express;
