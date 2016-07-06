var APIKey = require('../models/apikey');
var ConnectionString = require('../models/connection-string');
module.exports = {
  checkAPIKey: function(userid, keyType, callbackFn){
    APIKey.find({userid: userid, keyType: keyType}, function(err, keys){
      callbackFn(err, keys);
    })
  },
  createAPIKey: function(userid, keyType, callbackFn){
    var key = new APIKey({userid: userid, keyType: keyType});
    key.save(function(err){
      callbackFn(err, key);
    })
  },
  getUserFromAPIKey: function(apiKey, keyType, callbackFn){
    APIKey.find({api_key: apiKey, keyType: keyType}).populate('userid').exec(function(err, keys){
      callbackFn(err, keys);
    });
  },
  getConnectionString: function(userid, connectionName, callbackFn){
    ConnectionString.find({userid: userid, connection: connectionName}, function(err, connString){
      callbackFn(err, connString);
    })
  },
  storeConnectionString: function(userid, connectionName, connectionString, callbackFn){
    var connString = new ConnectionString({
      userid: userid,
      connection: connectionName,
      connectionString: connectionString
    });
    connString.save(function(err){
      callbackFn(err, connString);
    })
  },
  getUserConnections: function(userid, callbackFn) {
    ConnectionString.find({userid: userid}, function(err, connections){
      callbackFn(err, connections);
    })
  }
}
