var express = require('express');
var serveStatic = require('serve-static');
var open = require('open');

var app = express();
app.use(express.static(__dirname));

app.use("/main", function(req, res){  
  res.sendFile(__dirname + "/main.html");
});

app.listen(8000, function(){
  console.log('listening on port 8000');

  open('http://localhost:8000');

});
