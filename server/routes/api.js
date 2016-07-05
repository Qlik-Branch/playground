var express = require('express'),
    router = express.Router(),
    sampleData = require('../configs/sample-data'),
    sampleProjects = require('../configs/sample-projects'),
    dataConnections = require('../configs/data-connections'),
    mongoHelper = require('../controllers/mongo-helper'),
    generalConfig = require('../configs/general'),
    OAuthInfo = require('../configs/oauth-info'),
    QRS = require('../controllers/qrs');

router.get('/sampledata', function(req, res){
  res.json(sampleData);
});

router.get('/sampleprojects', function(req, res){
  res.json(sampleProjects);
});

router.get('/dataconnections', function(req, res){
  res.json(dataConnections);
});

router.get('/currentuser', function(req, res){
  res.json(req.user);
});

router.get('/currentuserconnections', function(req, res){
  console.log(req.user.username);
  mongoHelper.getUserConnections(req.user.username, function(err, connections){
    if(err){
      res.json({err});
    }
    else{
      res.json({connections});
    }
  });
});

router.get('/authorise/:connection', function(req, res){
  var dictionary = require('../../dictionaries/'+req.params.connection+'/dictionary');
  var connectionInfo = dataConnections[req.params.connection];
  var oAuthCreds = OAuthInfo[req.params.connection];
  console.log(connectionInfo);
  req.session.dictionary = dictionary;
  req.session.connectionInfo = connectionInfo;
  if(req.session.dictionary.auth_options.auth_version=="1.0"){
    req.session.consumerKey = oAuthCreds.consumerKey;
    req.session.consumerSecret = oAuthCreds.consumerSecret;
    var oauthparams = {
      callback: process.env.genericOAuthRedirectUrl,
      consumer_key: req.session.consumerKey,
      consumer_secret: req.session.consumerSecret
    };
    var url = req.session.dictionary.auth_options.oauth_request_url;
    Request.post({url:url, oauth:oauthparams}, function(err, response, body){
      var reqData = qs.parse(body);
      var authUrl = req.session.dictionary.auth_options.oauth_authorize_url;
      authUrl += "?" + qs.stringify({oauth_token: reqData.oauth_token});
      res.redirect(authUrl);
    });
  }
  else{
    var oauth_redirect_url_parameter = "redirect_uri";
    req.session.clientId = oAuthCreds.clientId;
    req.session.clientSecret = oAuthCreds.clientSecret;
    if(req.session.dictionary.auth_options.oauth_redirect_url_parameter && req.session.dictionary.auth_options.oauth_redirect_url_parameter!=""){
       oauth_redirect_url_parameter = req.session.dictionary.auth_options.oauth_redirect_url_parameter
    }
    res.redirect(req.session.dictionary.auth_options.oauth_authorize_url+"?client_id="+req.session.clientId+"&"+oauth_redirect_url_parameter+"="+process.env.genericOAuthRedirectUrl);
  }
});

router.get('/getAppInfo', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  QRS.getTicket(req.query, function(err, ticketResponse){
    if(err){
      res.json({err: err});
    }
    else{
      console.log(ticketResponse);
      mongoHelper.getConnectionString(ticketResponse.UserId, req.query.app, function(err, connectionStrings){
        if(err){
          res.json(err);
        }
        else if (connectionStrings.length==0) {
          res.json({err: "No connection found"});
        }
        else{
          var info = generalConfig;
          generalConfig.connectionString = connectionStrings[0].connectionString;
          generalConfig.loadscript = dataConnections[req.query.app].loadscript;
          res.json(generalConfig);
        }
      });
    }
  });
});

module.exports = router;
