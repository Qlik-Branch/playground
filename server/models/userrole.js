var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserRoleSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  permissions:{
    //example
    // project:{
    //   allOwners: false,
    //   create: true,
    //   read: true,
    //   update: true,
    //   delete: false
    // }
  },
  edituser: {
    type: Schema.ObjectId,
    ref: 'userprofiles'
  },
  createuser: {
    type: Schema.ObjectId,
    ref: 'userprofiles'
  }
});

module.exports = mongoose.model('userrole', UserRoleSchema);
