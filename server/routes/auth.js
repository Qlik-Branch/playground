var express = require('express'),
    router = express.Router(),
    request = require('request'),
    qs = require('querystring'),
    dataConnections = require('../configs/data-connections'),
    mongoHelper = require('../controllers/mongo-helper'),
    QRS = require('../controllers/qrs');

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

router.get('/connection/callback', function(req, res){
  if(req.query && req.user){
    var data = req.query;
    var session = req.session;
    var tokenUrl = session.dictionary.auth_options.oauth_token_url;
    var connectionInfo = dataConnections[session.connectionInfo.id]
    if (connectionInfo && connectionInfo.getAccessToken) {
      connectionInfo
        .getAccessToken(
          data,
          session.clientId,
          session.clientSecret,
          req.user._id,
          connectionInfo.id
        )
        .then(() => {
          saveConnectionString(req.user._id, connectionInfo.id,null, () => {
            res.redirect('/myplayground/mydata/' + connectionInfo.id)
          })
        })
        .catch(err => {
          console.error('Error getting access tokens', err)
        })
    }
    else {
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
        var connectionString = buildConnectionString(req.session.connectionInfo.directory, req.session.connectionInfo.endpoint, tokenData.oauth_token, tokenData.oauth_token_secret, session.consumerKey, session.consumerSecret);
        saveConnectionString(req.user._id, req.session.connectionInfo.id, connectionString, function(err){
          res.redirect('/myplayground/mydata/'+req.session.connectionInfo.id);
        })
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
        tokenUrl = tokenUrl.join("");
        var redirect_uri_parameter = "redirect_uri";
        if(session.dictionary.auth_options.oauth_redirect_url_parameter && session.dictionary.auth_options.oauth_redirect_url_parameter!=""){
          redirect_uri_parameter = session.dictionary.auth_options.oauth_redirect_url_parameter
        }
        tokenUrl += "&";
        tokenUrl += redirect_uri_parameter;
        tokenUrl += "=";
        tokenUrl += process.env.genericOAuthRedirectUrl;
      }
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
          var tokenData = getTokens(responseData);
          var connectionString = buildConnectionString(req.session.connectionInfo.directory, req.session.connectionInfo.endpoint, tokenData.access_token);
          saveConnectionString(req.user._id, req.session.connectionInfo.id, connectionString, function(err){
            res.redirect('/myplayground/mydata/'+req.session.connectionInfo.id);
          })

        }
      });
    }
    }
  }
});

function getTokens(data){
  var output = {};
  output = traverseProperties(data, output);
  return output;
}

function traverseProperties(input, output){
  console.log(input);
  for (var prop in input){
    if(typeof input[prop] === "object"){
      output = traverseProperties(input[prop], output);
    }
    else{
      if(prop.indexOf("token")!=-1){
        output[prop] = input[prop];
      }
    }
  }
  return output;
}

function buildConnectionString(dictionary, endpoint, token, tokenSecret, consumerKey, consumerSecret){
  var conn = "CUSTOM CONNECT TO \"provider=GenericRestConnector.exe;source=local;auth-method=OAuth";
  conn += ";dictionary="+dictionary;
  conn += ";url="+endpoint;
  if(tokenSecret){
    conn += ";password="+tokenSecret;
    conn += ";token="+token;
    if(consumerKey){
      conn += ";username="+consumerKey;
      conn += ";consumer_secret="+consumerSecret;
    }
  }
  else{
    conn += ";username=admin";
    conn += ";password="+token;
  }
  conn += "\"";
  return conn;
}

function saveConnectionString(userId, connectionId, connectionString, callbackFn){
  console.log('saving connection string');
  console.log(connectionId);
  console.log(userId);
  mongoHelper.getConnectionString(userId, connectionId, function(err, connectionStrings){
    console.log('checking for connection strings');
    console.log(connectionStrings);
    if(err){
      console.log('error checking connection strings after authorisation');
      res.redirect('/myplayground');
    }
    else{
        var connectionStringId;
        if(connectionStrings && connectionStrings.length>0){
          connectionStringId = connectionStrings[0].id;
        }
        mongoHelper.saveConnectionString(connectionStringId, userId, connectionId, connectionString, function(err, result){
          callbackFn(err);
        });
    }
  });
}

module.exports = router;
