var APIKey = require('../models/apikey');
var ConnectionString = require('../models/connection-string');
module.exports = {
  checkAPIKey: function(user, keyType, callbackFn){
    APIKey.find({userid: user, keyType: keyType}, function(err, keys){
      callbackFn(err, keys);
    })
  },
  createAPIKey: function(user, keyType, callbackFn){
    var key = new APIKey({userid: user, keyType: keyType});
    key.save(function(err){
      callbackFn(err, key);
    })
  },
  getUserFromAPIKey: function(apiKey, keyType, callbackFn){
    APIKey.find({api_key: apiKey, keyType: keyType}, function(err, keys){
      callbackFn(err, keys);
    });
  },
  getConnectionString: function(user, connectionName, callbackFn){
    ConnectionString.find({userid: user, connection: connectionName}, function(err, connString){
      callbackFn(err, connString);
    })
  },
  storeConnectionString: function(user, connectionName, connectionString, callbackFn){
    var connString = new ConnectionString({
      userid: user,
      connection: connectionName,
      connectionString: connectionString
    });
    connString.save(function(err){
      callbackFn(err, connString);
    })
  },
  getUserConnections: function(user, callbackFn) {
    ConnectionString.find({userid: user}, function(err, connections){
      callbackFn(err, connections);
    })
  }
}
