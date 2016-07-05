var express = require('express'),
    app = express(),
    passport = require('passport'),
    expressSession = require('express-session'),
    MongoStore = require('connect-mongo')(expressSession),
    mongoose = require('mongoose'),
    favicon = require('serve-favicon');

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

mongoose.connect(process.env.mongoconnectionstring);

app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/qlik', express.static(__dirname + '/node_modules/@qlik/leonardo-ui/dist'));
app.use('/css', express.static(__dirname + '/public/build'));
app.use('/js', express.static(__dirname + '/public/build'));
app.use('/resources', express.static(__dirname + '/public/resources'));
app.use('/views', express.static(__dirname + '/public/views'));
app.use('/configs', express.static(__dirname + '/public/configs'));
app.use('/dictionaries', express.static(__dirname + '/dictionaries'));
app.use(favicon(__dirname + '/public/resources/favicon.ico'));

require('./server/controllers/passport/passport.js')(passport);
app.use(expressSession({secret: 'mySecretKey', store: new MongoStore({ mongooseConnection: mongoose.connection})}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  res.redirect('/home');
});

//load in the routes
var apiRoutes = require(__dirname+'/server/routes/api');
var authRoutes = require(__dirname+'/server/routes/auth');

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

//all other routes should be dealt with by the client
app.get('/*', function(req, res){
  res.render(__dirname+'/server/views/index.jade', {});
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server listening on port "+(process.env.PORT || 3000));
});
