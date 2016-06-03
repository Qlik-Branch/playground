var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var apikeySchema = new Schema({
  api_key:{
    type: String,
    default: function(){
      return generateKey();
    }
  },
  user: String,
  keyType: String
});

function generateKey(size, chars) {
    size = size || 32;
    chars = chars || 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    var rnd = crypto.randomBytes(size), value = new Array(size), len = chars.length;
    for (var i = 0; i < size; i++) {
        value[i] = chars[rnd[i] % len]
    };
    return value.join('');
}

module.exports = mongoose.model('apikey', apikeySchema)