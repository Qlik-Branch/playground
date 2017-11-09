var APIKey = require('../models/apikey');
var ConnectionString = require('../models/connection-string');
var AuthToken = require('../models/auth-token')
var UserProfile = require('../models/userprofile')
module.exports = {
  checkAPIKey: function(userid, callbackFn){
    APIKey.find({userid: userid}, function(err, keys){
      callbackFn(err, keys);
    })
  },
  createAPIKey: function(userid, callbackFn){
    var key = new APIKey({userid: userid});
    key.save(function(err){
      callbackFn(err, key);
    })
  },
  getUserFromAPIKey: function(apiKey, callbackFn){
    APIKey.find({api_key: apiKey}).populate('userid').exec(function(err, keys){
      callbackFn(err, keys);
    });
  },
  getAuthToken: function(userid, connectionName, callbackFn){
    AuthToken.find({userid: userid, connection: connectionName}, function(err, authToken){
      if(err) {
        console.log("ERROR GETTING AUTH", err)
      }
      callbackFn(err, authToken[0]);
    })
  },
  saveAuthToken: function(authTokenId, userid, connectionName, accessToken, refreshToken, callbackFn){
    var authToken = {
      userid: userid,
      connection: connectionName,
      accessToken: accessToken,
      refreshToken: refreshToken
    };
    if(authTokenId){
      AuthToken.update(authTokenId, authToken, {upsert: true},  function(err){
        callbackFn(err);
      })
    }
    else{
      var conn = new AuthToken(authToken);
      conn.save(function(err){
        callbackFn(err);
      });
    }
  },
  updateAuthToken: function(userid, connectionName, data, returnUpdatedDocument, callbackFn){
    AuthToken.findOneAndUpdate({userid: userid, connection: connectionName}, data, {returnNewDocument: returnUpdatedDocument}, function(err, authToken){
      if(err){
        callbackFn(err);
      }
      else{
        callbackFn(null, authToken);
      }
    });
  },
  deleteAuthToken: function(userid, connectionName, callbackFn){
    AuthToken.find({userid: userid, connection: connectionName}).remove().exec(function(err){
      callbackFn(err);
    });
  },
  getConnectionString: function(userid, connectionName, callbackFn){
    ConnectionString.find({userid: userid, connection: connectionName}, function(err, connString){
      callbackFn(err, connString[0]);
    })
  },
  saveConnectionString: function(connectionStringId, userid, connectionName, connectionString, callbackFn){
    var connString = {
      userid: userid,
      connection: connectionName,
      connectionString: connectionString
    };
    if(connectionStringId){
      ConnectionString.update(connectionStringId, connString, {upsert: true},  function(err){
        callbackFn(err);
      })
    }
    else{
      var conn = new ConnectionString(connString);
      conn.save(function(err){
        callbackFn(err);
      });
    }
  },
  updateConnectionString: function(userid, connectionName, data, returnUpdatedDocument, callbackFn){
    ConnectionString.findOneAndUpdate({userid: userid, connection: connectionName}, data, {returnNewDocument: returnUpdatedDocument}, function(err, connectionString){
      if(err){
        callbackFn(err);
      }
      else{
        callbackFn(null, connectionString);
      }
    });
  },
  deleteConnectionString: function(userid, connectionName, callbackFn){
    ConnectionString.find({userid: userid, connection: connectionName}).remove().exec(function(err){
      callbackFn(err);
    });
  },
  getUserConnections: function(userid, callbackFn) {
    ConnectionString.find({userid: userid}, function(err, connections){
      callbackFn(err, connections);
    })
  },
  userVisited: function(userid, callbackFn) {
    UserProfile.findOne({"_id": userid}, function(err, user) {
      if (err) {
        callbackFn(err, null)
      } else if (user.playground_first_visited) {
        callbackFn(null, false)
      } else {
        user.playground_first_visited = new Date()
        user.save(function(saveErr, result) {
          if (saveErr) {
            callbackFn(saveErr, null)
          } else {
            callbackFn(null, true)
          }
        })
      }
    })
  }
}
