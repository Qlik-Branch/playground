var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var playgroundConnectionSchema = new Schema({
  id: Schema.ObjectId,
  user: String,
  connectionName: String,
  connectionString: String
});

module.exports = mongoose.model('playgroundconnection', playgroundConnectionSchema)
