var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var playgroundProjectSchema = new Schema({
  id: Schema.ObjectId,
  user: String,
  projectName: String,
  projectRepo: String
});

module.exports = mongoose.model('playgroundproject', playgroundProjectSchema)
