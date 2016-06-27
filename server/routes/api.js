var express = require('express'),
    router = express.Router(),
    sampleData = require('../configs/sample-data'),
    dataConnections = require('../configs/data-connections');

router.get('/sampledata', function(req, res){
  res.json(sampleData);
});

router.get('/dataconnections', function(req, res){
  res.json(dataConnections);
});

router.get('/currentuser', function(req, res){
  res.json(req.user);
});

router.post('/authorise/:connection', function(req, res){
  var dictionary = require('../../dictionaries/'+req.params.connection+'/dictionary');
  var connectionInfo = dataConnections[req.params.connection];
  console.log(connectionInfo);
  req.session.dictionary = dictionary;
  if(req.session.dictionary.auth_options.auth_version=="1.0"){
    req.session.consumerKey = connectionInfo.consumerKey;
    req.session.consumerSecret = connectionInfo.consumerSecret;
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
    req.session.clientId = connectionInfo.clientId;
    req.session.clientSecret = connectionInfo.clientSecret;
    if(req.session.dictionary.auth_options.oauth_redirect_url_parameter && req.session.dictionary.auth_options.oauth_redirect_url_parameter!=""){
       oauth_redirect_url_parameter = req.session.dictionary.auth_options.oauth_redirect_url_parameter
    }
    res.redirect(req.session.dictionary.auth_options.oauth_authorize_url+"?client_id="+req.session.clientId+"&"+oauth_redirect_url_parameter+"="+process.env.genericOAuthRedirectUrl);
  }
});

module.exports = router;
