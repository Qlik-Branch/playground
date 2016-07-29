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
      var parsedCookies = [];
      if(ticketResponse && ticketResponse.cookies){
        var cookies = ticketResponse.cookies;
        // for (var i=0;i<cookies.length;i++){
        //   console.log('cookie '+i);
        //   console.log(cookies[i]);
        //   var c = Cookie.parse(cookies[i]);
        //   if(c[process.env.sessionCookieName]){
        //     cookies[i] = cookies[i].replace('HttpOnly;','').replace('Secure;','').replace('Secure',''); //this is a horrible hacky approach
        //   }
        //   parsedCookies.push(cookies[i]);
        // }
        // console.log('got cookies');
        // console.log(ticketResponse.cookies);
        // console.log(parsedCookies);
        // res.setHeader('Set-Cookie', cookies);
      }
      res.send(JSON.stringify(ticketResponse));
    }
  });
});

module.exports = router;
