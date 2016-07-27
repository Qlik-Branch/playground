var express = require('express'),
    router = express.Router(),
    sampleData = require('../configs/sample-data'),
    sampleProjects = require('../configs/sample-projects'),
    dataConnections = require('../configs/data-connections'),
    mongoHelper = require('../controllers/mongo-helper'),
    generalConfig = require('../configs/general'),
    OAuthInfo = require('../configs/oauth-info'),
    Cookies = require('cookies'),
    cookieParser = require('cookie-parser'),
    QRS = require('../controllers/qrs');

router.get('/ticket', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  QRS.getTicket(req, function(err, cookies){
    console.log('got cookies');
    console.log(cookies);
    if(err){
      res.json({err: err});
    }
    else{
      var sessCookie = cookies.get(process.env.sessionCookieName);
      if(sessCookie){
        cookies.set(process.env.sessionCookieName, sessCookie, {httpOnly:false});
      }
      console.log(cookies);
      res.setHeader('Set-Cookie', cookies);
      res.send(JSON.stringify({}));
    }
  });
});

module.exports = router;
