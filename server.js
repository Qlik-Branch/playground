var express = require('express'),
    app = express(),
    passport = require('passport'),
    expressSession = require('express-session'),
    cookieParser = require('cookie-parser'),
    ntlm = require('express-ntlm'),
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
app.use('/showcaseresources', express.static(__dirname + '/public/views/showcase'));
app.use('/views', express.static(__dirname + '/public/views'));
app.use('/configs', express.static(__dirname + '/public/configs'));
app.use('/dictionaries', express.static(__dirname + '/dictionaries'));
app.use(favicon(__dirname + '/public/resources/favicon.ico'));

require('./server/controllers/passport/passport.js')(passport);

// app.use(cookieParser());

app.set('view engine', 'jade');
app.set('views', __dirname +'/server/views')

//load in the routes
var apiRoutes = require(__dirname+'/server/routes/api');
var serverRoutes = require(__dirname+'/server/routes/server');
var authRoutes = require(__dirname+'/server/routes/auth');
var showcaseRoutes = require(__dirname+'/server/routes/showcase');

app.use('/api', apiRoutes);
app.use('/liveshowcase', showcaseRoutes);

app.use(expressSession({
  secret: 'mySecretKey',
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie: {path:"/", domain:process.env.cookieDomain, httpOnly: false}
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/server', serverRoutes);
app.use('/auth', authRoutes);

app.get('/denied', function(req, res){
  res.render(__dirname+'/server/views/denied.jade', {});
});

var ntlmConfig ={
  debug: function() {
      var args = Array.prototype.slice.apply(arguments);
      console.log.apply(null, args);
  },
  domain: "QTSEL"
}

var accessList = [
  "nwr",
  "bmz",
  "akl",
  "rie",
  "baz",
  "jwr",
  "dsa",
  "pnt",
  "aai",
  "swr",
  "lhr",
  "axt",
  "bfk",
  "okg",
  "tmg",
  "dfs",
  "mry",
  "nby",
  "jyr",
  "gmn"
];

app.get('/', function(req, res){
  res.redirect('/home');
});

//all other routes should be dealt with by the client
app.get('/*',  ntlm(ntlmConfig), function(req, res){
  console.log('trying ot get to page');
  if(req.ntlm && accessList.indexOf(req.ntlm.UserName.toLowerCase())==-1){
    console.log('user doesnt exist');
    res.redirect('/denied');
  }
  else{
    console.log('user is');
    console.log(req.ntlm);
    res.render('index.jade', {});
  }
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server listening on port "+(process.env.PORT || 3000));
});
