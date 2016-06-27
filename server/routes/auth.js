var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    mongoHelper = require('../controllers/mongo-helper'),
    QRS = require('../controllers/qrs');

router.get('/github', passport.authenticate('github'), function(req, res, next){
});

router.get('/github/callback', passport.authenticate('github'), function(req, res, next) {
  if(req.user){
    mongoHelper.checkAPIKey(req.user.username, "playground", function(err, data){
      if(err){
        ////do something with the error
      }
      else{
        if(data && data.length > 0){
          //we have a key
          res.redirect('/');
        }
        else{
          mongoHelper.createAPIKey(req.user.username, "playground", function(err, key){
            res.redirect('/');
          });
        }
      }
    });
  }
  else{
    ////we have no user so we should do something here
    res.redirect('/');
  }
});

router.get('/connection/callback', function(req, res){
  if(req.query){
    var data = req.query;
    var tokenUrl = session.dictionary.auth_options.oauth_token_url;
    if(session.dictionary.auth_options.auth_version=="1.0"){
      var authData = qs.parse(req.body);
      console.log("Received auth data");
      console.log(authData);
      var oauthparams = {
        consumer_key: session.consumerKey,
        consumer_secret: session.consumerSecret,
        token: data.oauth_token,
        token_secret: data.oauth_token_secret,
        verifier: data.oauth_verifier
      };
      request.post({url:tokenUrl, oauth:oauthparams}, function(err, response, body){
        if(req.user.username.indexOf("anon_")!=-1){
          req.logout();
        }
        var tokenData = qs.parse(body);
        res.json({token: tokenData.oauth_token, tokenSecret: tokenData.oauth_token_secret});
      });
    }
    else{
      data.client_id = session.clientId;
      data.client_secret = session.clientSecret;
      if(session.dictionary.auth_options.oauth_params_in_query){
        if(tokenUrl.indexOf("?")==-1){
          tokenUrl+="?";
        }
        else{
          tokenUrl+="&";
        }
        for (var prop in data){
          tokenUrl+=prop;
          tokenUrl+="=";
          tokenUrl+=data[prop];
          tokenUrl+="&";
        }
        tokenUrl = tokenUrl.split("");
        tokenUrl.pop();
        console.log(tokenUrl);
        tokenUrl = tokenUrl.join("");
        var redirect_uri_parameter = "redirect_uri";
        if(session.dictionary.auth_options.oauth_redirect_url_parameter && session.dictionary.auth_options.oauth_redirect_url_parameter!=""){
          redirect_uri_parameter = session.dictionary.auth_options.oauth_redirect_url_parameter
        }
        tokenUrl += "&";
        tokenUrl += redirect_uri_parameter;
        tokenUrl += "=";
        tokenUrl += process.env.oauth_redirect_uri;
      }
      console.log(tokenUrl);
      request({url:tokenUrl, formData: data}, function(err, response, body){
        if(err){
          console.log(err);
        }
        else{
          var responseData;
          if(body.indexOf("{")!=-1){
            responseData = JSON.parse(body);
          }
          else{
            responseData = qs.parse(body);
          }
          console.log(responseData);
          var tokenData = getTokens(responseData);
          console.log(tokenData);
          if(req.user.username.indexOf("anon_")!=-1){
            req.logout();
          }
          res.json({token: tokenData.access_token});
        }
      });
    }
  }
});


router.get('/apikey', function(req, res){
  console.log("here at least");
  QRS.getTicket(req, res);
});

module.exports = router;
