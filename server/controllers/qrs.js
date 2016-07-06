var https = require('https'),
    fs = require('fs'),
    Url = require('url'),
    crypto = require('crypto'),
    Cookie = require('cookie'),
    Guid = require('guid'),
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
  getTicketx: function(req, res){
    var that = this;
    res.header("Access-Control-Allow-Origin", "*")
    var data = {
      UserDirectory: "GitHub",
      UserId: "test",
      Attributes: [],
      TargetId: req.query.targetId
    }
    that.qPost(QPS, req.query.proxyRestUri, data, function(err, data){
      console.log(data);
      var ticket = JSON.parse(data);
      var redirectURI = ticket.TargetUri + '?QlikTicket=' + ticket.Ticket;
      res.writeHead(302, {'Location': redirectURI});
      res.end();
    });
  },
  getTicket: function(query, callbackFn){
    var that = this;
    mongoHelper.getUserFromAPIKey(query.apikey, "playground", function(err, keys){
      console.log(keys[0].userid);
      if(err){
        ////do something here
        callbackFn({err: err});
      }
      else{
        if(keys && keys.length > 0){
          var data = {
            UserDirectory: "GitHub",
            UserId: keys[0].userid,
            Attributes: []
          }
          that.qPost(QPS, (query.proxyRestUri || "/qps/playground") + "/ticket/", data, function(err, data){
            console.log(data);
            callbackFn(null, JSON.parse(data));
          });
        }
        else{
          callbackFn({err: "API Key not valid"});
        }
      }
    });
  },
  checkOrCreateSession: function(req, callbackFn){
    var that = this;
    var query = req.query;
    console.log(query);
    var cookies = Cookie.parse(req.headers.cookie || "");
    console.log(cookies);
    var session = {};
    var hasSessionCookie = false;
    for (var c in cookies){
      console.log(c);
      console.log(cookies[c]);
      if(c==process.env.sessionCookieName){
        hasSessionCookie = true;
        session.id = cookies[c];
        break;
      }
    }
    mongoHelper.getUserFromAPIKey(query.apikey, "playground", function(err, keys){
      console.log(keys);
      if(err){
        ////do something here
        callbackFn(err);
      }
      else{
        if(keys && keys.length > 0){
          var data = {
            UserDirectory: "GitHub",
            UserId: keys[0].userid.username,
            Attributes: [],
            SessionId: Guid.create().value
          }
          console.log(data);
          if(hasSessionCookie){
            //we potentially have a session so we can check it
            that.qGet(QPS, (query.proxyRestUri || "/qps/playground") + "/session/"+session.id, function(err, session){
              console.log('existing session is');
              console.log(session);
              if(err){
                callbackFn(err);
              }
              else if(!JSON.parse(session)){
                that.qPost(QPS, (query.proxyRestUri || "/qps/playground") + "/session/", data, function(err, session){
                  if(err){
                    callbackFn(err);
                  }
                  else{
                    session = JSON.parse(session);
                    session.origUserId = keys[0].userid._id;
                    callbackFn(null, session);
                  }
                });
              }
              else{
                session = JSON.parse(session);
                session.origUserId = keys[0].userid._id;
                callbackFn(null, session);
              }
            })
          }
          else{
            //no session cookie exists so we create one
            that.qPost(QPS, (query.proxyRestUri || "/qps/playground") + "/session/", data, function(err, session){
              if(err){
                callbackFn(err);
              }
              else{
                session = JSON.parse(session);
                session.origUserId = keys[0].userid._id;
                callbackFn(null, session);
              }
            });
          }
        }
        else{
          callbackFn("API Key not valid");
        }
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
      //settings.host = Url.parse(url).hostname;
      settings.host =  '192.168.1.83';
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
          'Access-Control-Allow-Origin': '*';
        },
        key: key,
        cert: cert,
        rejectUnauthorized: false
    };

    if(url.indexOf("http")!=-1){
      //settings.host = Url.parse(url).hostname;
      settings.host =  '192.168.1.83';
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
  }
}
