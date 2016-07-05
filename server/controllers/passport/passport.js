var UserRole = require('../../models/userrole');
var UserProfile = require('../../models/userprofile');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    UserProfile.findOne({"_id": id}).populate('role').exec(function(err, user) {
      done(err, user);
    });
  });
}
