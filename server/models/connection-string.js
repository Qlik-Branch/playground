var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var connStringSchema = new Schema({
  // userid:{
  //   type: Schema.ObjectId,
  //   ref: 'userprofiles'
  // },
  userid: Schema.ObjectId,
  createdate: {
    type: Date,
    default: Date.now
  },
  connection: String,
  connectionString: String
});

module.exports = mongoose.model('connectionstring', connStringSchema)
