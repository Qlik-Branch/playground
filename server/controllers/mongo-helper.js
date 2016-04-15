var APIKey = require('../models/apikey');
module.exports = {
  checkAPIKey: function(user, keyType, callbackFn){
    APIKey.find({user: user, keyType: keyType}, function(err, keys){
      callbackFn.call(null, err, keys);
    })
  },
  createAPIKey: function(user, keyType, callbackFn){
    var key = new APIKey({user: user, keyType: keyType});
    key.save(function(err){
      callbackFn.call(null, err, key);
    })
  },
  getUserFromAPIKey: function(apiKey, keyType, callbackFn){
    APIKey.find({api_key: apiKey, keyType: keyType}, function(err, keys){
      callbackFn.call(null, err, keys);
    });
  }
}
