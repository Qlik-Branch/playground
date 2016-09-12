var https = require('https'),
    fs = require('fs'),
    Url = require('url'),
    crypto = require('crypto'),
    request = require('request'),
    Guid = require('guid'),
    QSocks = require('qsocks'),
    qsocksConfig = require('../configs/general'),
    dataConnections = require('../configs/data-connections'),
    mongoHelper = require('./mongo-helper');

var QRS = "4242", QPS = "4243";

module.exports = {
  getExampleApps: function(res){
    this.qGet(QRS, '/qrs/app', function(err, data){
      if(err){
        res.json({err: err});
      }
      else{
        data = JSON.parse(data);
        data = data.filter(function(app){
          return (app.stream !== null && process.env.streams.indexOf(app.stream.name)!=-1);
        });
        res.json(data);
      }
    });
  },
  getTicket: function(req, callbackFn){
    var that = this;
    var query = req.query;
    mongoHelper.getUserFromAPIKey(query.apikey, function(err, keys){
      console.log('checked user');
      if(err){
        console.log('error fetching user from api key');
        console.log(err);
        callbackFn({err: err});
      }
      else{
        console.log('keys are');
        console.log(keys);
        if(keys && keys.length > 0){
          var data = {
            UserDirectory: "Playground",
            UserId: keys[0].userid.username,
            Attributes: [{"source":"client"}]
          }
          that.qPost(QPS, (query.proxyRestUri || "/qps/playground") + "/ticket/", data, function(err, ticketResponse){
            if(err){
              callbackFn(err);
            }
            else{
              console.log(ticketResponse);
              var ticket = JSON.parse(ticketResponse);
              if(ticket.Ticket){
                callbackFn(null, {cookies: null, ticket: ticket.Ticket});
              }
              else {
                callbackFn(null);
              }
            }
          });
        }
        else{
          console.log('keys are');
          console.log(keys);
          callbackFn("API Key not valid");
        }
      }
    });
  },
  fakeHub: function(ticket, callbackFn){
    request.get(process.env.fakeHub+'?qlikTicket='+ticket, function(err, response, body){
      callbackFn(err, response);
    });
  },
  checkApp: function(appId, callbackFn){

  },
  stopApp: function(user, appId, callbackFn){
    var that = this;
    mongoHelper.updateConnectionString(user._id, appId, {$unset:{appid:""}}, false, function(err, connectionString){
      console.log('old conn string is');
      console.log(connectionString);
      if(connectionString && connectionString.appid){
        that.qDelete(QRS, "/qrs/app/"+connectionString.appid, function(err, response){
          if(err){
            console.log(err);
            callbackFn(err);
          }
          else{
            callbackFn();
          }
        });
      }
      else{
        callbackFn();
      }
    });
  },
  reloadApp: function(user, appId, callbackFn){
    var connectionDetails;
    if(!user){
      callbackFn("No User", null);
      return;
    }
    if(!appId){
      callbackFn("No app specified", null);
      return;
    }
    if(!dataConnections[appId]){
      callbackFn("Invalid app specified", null);
      return;
    }
    else {
      connectionDetails = dataConnections[appId];
    }
    var config = cloneObject(qsocksConfig);
    var data = {
      UserDirectory: "Playground",
      UserId: user.username,
      Attributes: [{"source":"server"}]
    }
    this.qPost(QPS, "/qps/playground" + "/ticket/", data, function(err, ticketResponse){
      if(err){
        callbackFn(err, null);
      }
      else{
        var ticket = JSON.parse(ticketResponse);
        config.ticket = ticket.Ticket;
        console.log('got ticket');
        mongoHelper.getConnectionString(user._id, appId, function(connectionString){
          QSocks.Connect(config).then(function(global){
            console.log('connected');
            console.log('app id is');
            console.log(connectionString.appid);
            global.openDoc(connectionString.appid).then(function(qApp){
              var reloadFinished = false;
              qApp.doReload().then(function(response){
                reloadFinished = true;
                qApp.doSave().then(function(){
                  qApp.connection.close();
                  callbackFn(null, connectionString.appid);
                });
              });
              getReloadProgress(global);

              function getReloadProgress(g) {
                g.getProgress(0).then(function (reloadProgress) {
                  // console.log(reloadProgress);
                  if (!reloadFinished) {
                    getReloadProgress(g);
                  }
                });
              }
            });
          });
        });
      }
    });
  },
  startApp: function(user, appId, callbackFn){
    var connectionDetails;
    if(!user){
      callbackFn("No User", null);
      return;
    }
    if(!appId){
      callbackFn("No app specified", null);
      return;
    }
    if(!dataConnections[appId]){
      callbackFn("Invalid app specified", null);
      return;
    }
    else {
      connectionDetails = dataConnections[appId];
    }
    var config = cloneObject(qsocksConfig);
    var data = {
      UserDirectory: "Playground",
      UserId: user.username,
      Attributes: [{"source":"server"}]
    }
    this.qPost(QPS, "/qps/playground" + "/ticket/", data, function(err, ticketResponse){
      if(err){
        callbackFn(err, null);
      }
      else{
        var ticket = JSON.parse(ticketResponse);
        config.ticket = ticket.Ticket;
        QSocks.Connect(config).then(function(global){
          global.createApp(connectionDetails.name).then(function(qApp){
            if(qApp.qSuccess==true){
              var newAppId = qApp.qAppId;
              mongoHelper.updateConnectionString(user._id, appId, {appid: newAppId}, true, function(err, connectionString){
                console.log('connectionString updated');
                console.log(connectionString);
                if(err){
                  callbackFn(err, null);
                }
                else{
                  global.openDoc(newAppId).then(function(qApp){
                    var reloadFinished = false;
                    var script = connectionString.connectionString += "; ";
                    script += connectionDetails.loadscript;
                    console.log('setting script');
                    qApp.setScript(script).then(function(){
                      console.log('reloading');
                      qApp.doReload().then(function(response){
                        reloadFinished = true;
                        qApp.doSave().then(function(){
                          qApp.connection.close();
                          callbackFn(null, connectionString.appid);
                        });
                      });
                      getReloadProgress(global);

                      function getReloadProgress(g) {
                        g.getProgress(0).then(function (reloadProgress) {
                          // console.log(reloadProgress);
                          if (!reloadFinished) {
                            getReloadProgress(g);
                          }
                        });
                      }
                    });
                  });
                }
              });
            }
            else{
              callbackFn("Could not create the app", null);
            }
          }, function(err){
            console.log(err);
            callbackFn(err);
          });
        });
      }
    });

  },
  generateXrfkey: function (size, chars) {
      size = size || 16;
      chars = chars || 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
      var rnd = crypto.randomBytes(size), value = new Array(size), len = chars.length;
      for (var i = 0; i < size; i++) {
          value[i] = chars[rnd[i] % len]
      };
      return value.join('');
  },
  qGet: function(api, url, callbackFn){
    try {
      console.log(process.env.appRoot+process.env.cert);
        var cert = fs.readFileSync(process.env.appRoot+process.env.cert);
        var key = fs.readFileSync(process.env.appRoot+process.env.certkey);
    } catch (e) {
        callbackFn.call(null, 'Missing client certificate');
        return;
    }
    var xrfkey = this.generateXrfkey();

    var settings = {
        method: 'GET',
        headers: {
          'x-qlik-xrfkey': xrfkey,
          'X-Qlik-User': 'UserDirectory= Internal;UserId= sa_repository'
        },
        key: key,
        cert: cert,
        rejectUnauthorized: false
    };

    if(url.indexOf("http")!=-1){
      settings.host = Url.parse(url).hostname;
      // settings.host =  '192.168.1.83';
      settings.port = Url.parse(url).port;
      settings.path = Url.parse(url).path+'?xrfkey='+xrfkey;
    }
    else {
      settings.host = process.env.senseserver;
      settings.port = api;
      settings.path = url+'?xrfkey='+xrfkey;
    }

    var data = "";
    https.get(settings, function (response) {
      response.on('data', function (chunk) {
        data+=chunk;
      });
      response.on('end', function(){ //we don't get all the data at once so we need to wait until the request has finished before we end the response
        callbackFn.call(null, null, data);
      });
    }).on('error', function(e){
      callbackFn.call(null, e);
    });
  },
  qPost: function(api, url, data, callbackFn){
    console.log(data);
    try {
      console.log(process.env.appRoot+process.env.cert);
        var cert = fs.readFileSync(process.env.appRoot+process.env.cert);
        var key = fs.readFileSync(process.env.appRoot+process.env.certkey);
    } catch (e) {
        callbackFn.call(null, 'Missing client certificate');
        return;
    }
    var xrfkey = this.generateXrfkey();
    var settings = {
        method: 'POST',
        headers: {
          'x-qlik-xrfkey': xrfkey,
          'X-Qlik-User': 'UserDirectory= Internal;UserId= sa_repository',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        key: key,
        cert: cert,
        rejectUnauthorized: false
    };

    if(url.indexOf("http")!=-1){
      settings.host = Url.parse(url).hostname;
      // settings.host =  '192.168.1.83';
      settings.port = Url.parse(url).port;
      settings.path = Url.parse(url).path+'?xrfkey='+xrfkey;
    }
    else {
      settings.host = process.env.senseserver;
      settings.port = api;
      settings.path = url+'?xrfkey='+xrfkey;
    }
    console.log(settings);

    var output = "";
    var postReq = https.request(settings, function(postRes){
      postRes.on('data', function (chunk) {
        output+=(""+chunk);
      });
      postRes.on('end', function(){ //we don't get all the data at once so we need to wait until the request has finished before we end the response
        callbackFn.call(null, null, output);
      });
    });

    postReq.write(JSON.stringify(data));
    postReq.end();

    postReq.on('error', function(e){
      callbackFn.call(null, e);
    });
  },
  qDelete: function(api, url, callbackFn){
    try {
      console.log(process.env.appRoot+process.env.cert);
        var cert = fs.readFileSync(process.env.appRoot+process.env.cert);
        var key = fs.readFileSync(process.env.appRoot+process.env.certkey);
    } catch (e) {
        callbackFn.call(null, 'Missing client certificate');
        return;
    }
    var xrfkey = this.generateXrfkey();

    var settings = {
        method: 'DELETE',
        headers: {
          'x-qlik-xrfkey': xrfkey,
          'X-Qlik-User': 'UserDirectory= Internal;UserId= sa_repository'
        },
        key: key,
        cert: cert,
        rejectUnauthorized: false
    };

    if(url.indexOf("http")!=-1){
      settings.host = Url.parse(url).hostname;
      // settings.host =  '192.168.1.83';
      settings.port = Url.parse(url).port;
      settings.path = Url.parse(url).path+'?xrfkey='+xrfkey;
    }
    else {
      settings.host = process.env.senseserver;
      settings.port = api;
      settings.path = url+'?xrfkey='+xrfkey;
    }

    var data = "";
    https.get(settings, function (response) {
      response.on('data', function (chunk) {
        data+=chunk;
      });
      response.on('end', function(){ //we don't get all the data at once so we need to wait until the request has finished before we end the response
        callbackFn.call(null, null, data);
      });
    }).on('error', function(e){
      callbackFn.call(null, e);
    });
  }
}

function cloneObject(objectToClone){
  var clone = {};
  for (var key in objectToClone){
    clone[key] = objectToClone[key];
  }
  return clone;
}
