var UserRole = require('../../models/userrole');
var UserProfile = require('../../models/userprofile');
var mongoHelper = require('../../controllers/mongo-helper');

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    UserProfile.findOne({"_id": id}).populate('role').exec(function(err, user) {
      mongoHelper.checkAPIKey(id, "playground", function(err, data){
        if(err){
          console.log('error checking api key');
          console.log(err);
        }
        else{
          if(data && data.length > 0){
            //we have a key
            user.apiKey = data[0].api_key;
            done(null, user);
          }
          else{
            mongoHelper.createAPIKey(id, "playground", function(err, key){
              user.apiKey = key.api_key;
              done(null, user);
            });
          }
        }
      });
    });
  });
}
