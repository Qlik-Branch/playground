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
  QRS.getTicket(req, function(err, ticketResponse){
    if(err){
      res.json({err: err});
    }
    else{      
      if(ticketResponse && ticketResponse.cookies){
        res.setHeader('Set-Cookie', ticketResponse.cookies);
      }
      res.send(JSON.stringify(ticketResponse));
    }
  });
});

module.exports = router;
