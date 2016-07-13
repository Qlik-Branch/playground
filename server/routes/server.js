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

router.get('/sampledata', function(req, res){
  res.json(sampleData);
});

router.get('/sampleprojects', function(req, res){
  res.json(sampleProjects);
});

router.get('/dataconnections', function(req, res){
  res.json(dataConnections);
});

router.get('/connectioninfo/:id', function(req, res){
  var connectionId = req.params.id;
  mongoHelper.getConnectionString(req.user._id, connectionId, function(err, connectionString){
    if(err){
      res.json({err: err});
    }
    else{
      console.log('new conn string is');
      console.log(connectionString);
      var config = cloneObject(generalConfig);
      config.apiKey = req.user.apiKey;
      if(connectionString.appid){
        config.appname = connectionString.appid;
        res.json(config);
      }
      else{
        delete config.appname;
        res.json(config);
      }
    }
  });
});

router.get('/configs', function(req, res) {
  res.json({
    loginUrl: process.env.loginUrl,
    returnUrl: process.env.returnUrl
  });
});

router.get('/startapp/:app', function(req, res){
  var app = req.params.app;
  QRS.startApp(req.user, app, function(err, appId){
    if(err){
      res.json(err);
    }
    else{
      res.redirect('/server/connectioninfo/'+app);
    }
  });
});

router.get('/stopapp/:app', function(req, res){
  var app = req.params.app;
  QRS.stopApp(req.user, app, function(err, appId){
    if(err){
      res.json(err);
    }
    else{
      res.redirect('/server/connectioninfo/'+app);
    }
  });
});

router.get('/reloadapp/:app', function(req, res){
  var app = req.params.app;
  QRS.reloadApp(req.user, app, function(err, appId){
    res.redirect('/server/connectioninfo/'+app);
  });
});

router.get('/currentuser', function(req, res){
  if(req.user){
    console.log(req.user);
    res.json(req.user);
  }
  else{
    res.json();
  }

});

router.get('/currentuserconnections', function(req, res){
  if(req.user){
    mongoHelper.getUserConnections(req.user._id, function(err, connections){
      if(err){
        res.json({err});
      }
      else{
        res.json({connections});
      }
    });
  }
  else{
    res.json({connections:[]});
  }
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

function cloneObject(objectToClone){
  var clone = {};
  for (var key in objectToClone){
    clone[key] = objectToClone[key];
  }
  return clone;
}

module.exports = router;
