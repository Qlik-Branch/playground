var express = require('express'),
    router = express.Router(),
    sampleData = require('../configs/sample-data'),
    sampleProjects = require('../configs/sample-projects'),
    dataConnections = require('../configs/data-connections'),
    showcaseProjects = require('../configs/showcase-projects'),
    mongoHelper = require('../controllers/mongo-helper'),
    generalConfig = require('../configs/general'),
    OAuthInfo = require('../configs/oauth-info'),
    Cookie = require('cookie'),
    cookieParser = require('cookie-parser'),
    QRS = require('../controllers/qrs'),
    http = require('http'),
    request = require('request'),
    qs = require('querystring');

router.get('/sampledata', function(req, res){
  res.json(sampleData);
});

router.get('/sampleprojects', function(req, res){
  res.json(sampleProjects);
});

router.get('/resource/:id', function(req, res){
  var data = "";
  http.get("http://branch.qlik.com/api/resource/"+req.params.id, function (response) {
    response.on('data', function (chunk) {
      data+=chunk;
    });
    response.on('end', function(){ //we don't get all the data at once so we need to wait until the request has finished before we end the response
      res.json(data);
    });
  }).on('error', function(e){
    res.json(e);
  });
});

router.get('/dataconnections', function(req, res){
  res.json({
    dataConnections,
    sampleData,
    sampleProjects
  });
});

router.get('/showcaseitems', function(req, res){
  res.json(showcaseProjects);
});

router.get('/connectioninfo/:id', function(req, res){
  var connectionId = req.params.id;
  var config = cloneObject(generalConfig);
  if(req.user){
    config.apiKey = req.user.apiKey;
  }
  if(connectionId=="noobs"){
    config.prefix = "/showcase";
    config.appname = "5612eefb-818a-4eb6-bd02-c7967c3f2d8e";
    // config.prefix = "/anon";
    // config.appname = "45b26db7-fde5-4064-9889-2e7c5dad2589";
    res.json(config);
  }
  else if(sampleData[connectionId]){
    config.appname = sampleData[connectionId].app;
    res.json(config);
  }
  else{
    mongoHelper.getConnectionString(req.user._id, connectionId, function(err, connectionString){
      if(err){
        res.json({err: err});
      }
      else{
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
  }
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
      res.json({});
      // res.redirect('/server/connectioninfo/'+app);
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
      res.json({});
      // res.redirect('/server/connectioninfo/'+app);
    }
  });
});

router.get('/reloadapp/:app', function(req, res){
  var app = req.params.app;
  QRS.reloadApp(req.user, app, function(err, appId){
    if(err){
      res.json(err);
    }
    else{
      res.json({});
    }
  });
});

router.get('/deleteconnection/:id', function(req, res){
  var connectionId = req.params.id;
  mongoHelper.deleteConnectionString(req.user._id, connectionId, function(err, connectionString){
    if(err){
      res.json({err: err});
    }
    else {
      res.json({});
    }
  });
});

router.get('/visited', function(req, res){
  if(req.user){
    mongoHelper.userVisited(req.user._id, function(err, success){
      if(err){
        res.json({err});
      }
      else{
        res.json({
          success: success
        });
      }
    });
  }
  else{
    res.json({
      success: false
    });
  }

});

router.get('/currentuser', function(req, res){
  if(req.user){
    mongoHelper.getUserConnections(req.user._id, function(err, connections){
      if(err){
        res.json({err});
      }
      else{
        res.json({
          user: req.user,
          myConnections: connections,
          loginUrl: process.env.loginUrl,
          returnUrl: process.env.returnUrl,
          dataConnections,
          sampleData,
          sampleProjects
        });
      }
    });
  }
  else{
    res.json({
      loginUrl: process.env.loginUrl,
      returnUrl: process.env.returnUrl,
      dataConnections,
      sampleData,
      sampleProjects
    });
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
    request.post({url:url, oauth:oauthparams}, function(err, response, body){
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
