var express = require('express'),
    router = express.Router(),
    request = require('request'),
    qs = require('querystring'),
    mongoHelper = require('../controllers/mongo-helper'),
    QRS = require('../controllers/qrs');

router.get('/connection/callback', function(req, res){
  if(req.query){
    var data = req.query;
    var session = req.session;
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
          mongoHelper.getConnectionString(req.user.username, req.session.connectionInfo.id, function(err, connectionStrings){
            if(err){
              console.log('error getting checking connection strings after authorisation');
              res.redirect('/myplayground');
            }
            else if (connectionStrings.length==0) {
              console.log('token data');
              console.log(tokenData);
              var connectionString = buildConnectionString(req.session.connectionInfo.directory, req.session.connectionInfo.endpoint, tokenData.access_token);
              mongoHelper.storeConnectionString(req.user.username, req.session.connectionInfo.id, connectionString, function(err, result){
                if(err){
                  console.log(err);
                  res.redirect('/myplayground');
                }
                else {
                  res.redirect('/myplayground');
                }
              });
            }
            else{
              res.redirect('/myplayground');
            }
          });

        }
      });
    }
  }
});

// CUSTOM CONNECT TO "provider=GenericRestConnector.exe;dictionary=56e938e8d3df80c638eb971e;source=online;auth-method=OAuth;url=https://api.untappd.com;dictionaryurl=https://api.github.com/repos/websy85/untappd-dictionary/contents/dictionary.json;"
// CUSTOM CONNECT TO "provider=GenericRestConnector.exe;dictionary=greenline-dictionary-master;source=local;auth-method=Basic;url=http://192.168.1.166:3002;username=admin;"

router.get('/apikey', function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  QRS.getTicket(req.query, function(err, ticketResponse){
    if(err){
      res.json({err: err});
    }
    else{
      res.json(ticketResponse);
    }
  });
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

function buildConnectionString(dictionary, endpoint, token, tokenSecret){
  var conn = "CUSTOM CONNECT TO \"provider=GenericRestConnector.exe;source=local;auth-method=OAuth;username=admin;";
  conn += "dictionary="+dictionary;
  conn += ";url="+endpoint;
  if(tokenSecret){
    conn += ";password="+tokenSecret;
    conn += ";token="+token;
  }
  else{
    conn += ";password="+token;
  }
  conn += "\"";
  return conn;
}

module.exports = router;
