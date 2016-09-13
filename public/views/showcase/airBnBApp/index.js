var express = require('express'),
    app = express();

app.use('/resources', express.static(__dirname + '/resources'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use("/main", function(req, res){  
  res.sendFile(__dirname+"/main.html");
});

app.use("/", function(req, res){
  res.sendFile(__dirname+"/index.html");
});

app.listen(8000, function(){
  console.log('listening on port 8000');
});
