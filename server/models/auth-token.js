var mongoose = require('mongoose'),
  Schema = mongoose.Schema

var tokenSchema = new Schema({
  userid: Schema.ObjectId,
  createdate: {
    type: Date,
    default: Date.now
  },
  connection: String,
  accessToken: String,
  refreshToken: String,
  appid: String
})

module.exports = mongoose.model('authtoken', tokenSchema)
