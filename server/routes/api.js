var express = require('express'),
    router = express.Router(),
    sampleData = require('../configs/sample-data'),
    sampleProjects = require('../configs/sample-projects'),
    dataConnections = require('../configs/data-connections'),
    mongoHelper = require('../controllers/mongo-helper'),
    generalConfig = require('../configs/general'),
    OAuthInfo = require('../configs/oauth-info'),
    Cookie = require('cookie'),
    cookieParser = require('cookie-parser'),
    QRS = require('../controllers/qrs');

router.get('/ticket', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  QRS.getTicket(req.query, function(err, ticket){
    console.log('got ticket');
    if(err){
      res.json({err: err});
    }
    else{
      console.log("ticket is "+ticket);
      res.send(JSON.stringify({ticket:ticket}));
    }
  });
});

router.get('/getAppInfoX', function(req, res){
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  QRS.checkOrCreateSession(req, function(err, sessionResponse){
    console.log(sessionResponse);
    if(err){
      res.send(JSON.stringify({err:err}));
    }
    else{
      console.log(req.session);
      console.log('setting cookie header');
      var cookies = [];
      for (var c in sessionResponse.cookies){
        if(c==process.env.sessionCookieName){
          cookies.push(Cookie.serialize(c,sessionResponse.cookies[c], {httpOnly: false}));
        }
        else{
          cookies.push(Cookie.serialize(c,sessionResponse.cookies[c]));
        }
      }

      // res.setHeader('Set-Cookie', cookies.join());
      // var sessCookie = Cookie.serialize(process.env.sessionCookieName, sessionResponse.session.SessionId, {domain: process.env.cookieDomain, httpOnly: false});
      // res.cookie(sessCookie);
      mongoHelper.getConnectionString(sessionResponse.session.origUserId, req.query.app, function(err, connectionStrings){
        if(err){
          res.send(JSON.stringify({err:err}));
        }
        else if (connectionStrings.length==0) {
          res.send(JSON.stringify({err: "No connection found"}));
        }
        else{
          var info = generalConfig;
          if(sessionResponse.session.Ticket){
            generalConfig.ticket = sessionResponse.session.Ticket;
          }
          generalConfig.connectionString = connectionStrings[0].connectionString;
          generalConfig.loadscript = dataConnections[req.query.app].loadscript;
          res.send(JSON.stringify(generalConfig));
        }
      });
    }
  });
});

module.exports = router;
