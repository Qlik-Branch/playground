var express = require('express'),
    app = express(),
    passport = require('passport'),
    expressSession = require('express-session');

try{
  var config = require('./config');
  var path = require('path');
  process.env.appRoot = path.resolve(__dirname);
  if(config){
    for(var c in config){
        process.env[c] = config[c];
    }
  }
}
catch(err){
  //config file doesn't exist
  console.log("No configuration file found.");
}

//configure passport strategies
require(__dirname +'/server/controllers/passport/passport.js')(passport);

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/qlik', express.static(__dirname + '/node_modules/@qlik/leonardo-ui/dist'));
app.use('/css', express.static(__dirname + '/public/build'));
app.use('/js', express.static(__dirname + '/public/build'));
app.use('/resources', express.static(__dirname + '/public/resources'));

app.use(expressSession({secret: 'playground'}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  res.render(__dirname+'/server/views/index.jade', {});
});

app.get('/:page', function(req, res){
  res.render(__dirname+'/server/views/'+req.params.page+'.jade', {});
});

//load in the routes
var apiRoutes = require(__dirname+'/server/routes/api');
var authRoutes = require(__dirname+'/server/routes/auth');

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

app.listen(process.env.PORT || 3000, function(){
  console.log("Server listening on port "+(process.env.PORT || 3000));
});
