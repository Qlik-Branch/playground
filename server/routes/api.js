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

router.get('/getAppInfo', function(req, res){
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
        cookies.push(c+"="+sessionResponse.cookies[c]+";");
      }

      // res.setHeader('Set-Cookie', cookies.join());
      res.cookie(process.env.sessionCookieName, sessionResponse.session.SessionId, {httpOnly: false});
      mongoHelper.getConnectionString(sessionResponse.session.origUserId, req.query.app, function(err, connectionStrings){
        if(err){
          res.send(JSON.stringify({err:err}));
        }
        else if (connectionStrings.length==0) {
          res.send(JSON.stringify({err: "No connection found"}));
        }
        else{
          var info = generalConfig;
          generalConfig.connectionString = connectionStrings[0].connectionString;
          generalConfig.loadscript = dataConnections[req.query.app].loadscript;
          res.send(JSON.stringify(generalConfig));
        }
      });
    }
  });
});

module.exports = router;
