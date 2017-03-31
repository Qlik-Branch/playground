var UserRole = require('../../models/userrole');
var UserProfile = require('../../models/userprofile');
var mongoHelper = require('../../controllers/mongo-helper');
const marketo = require('../../marketo/marketo')

module.exports = function(passport){
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    UserProfile.findOne({"_id": id}).populate('role').exec(function(err, user) {
      mongoHelper.checkAPIKey(id, function(err, data){
        if(err){
          console.log('error checking api key');
          console.log(err);
        }
        else{
          if(data && data.length > 0){
            //we have a key
            user.apiKey = data[0].api_key;
            checkMarketo(user,done)
          }
          else{
            mongoHelper.createAPIKey(id, function(err, key){
              user.apiKey = key.api_key;
              checkMarketo(user,done)
            });
          }
        }
      });
    });
  });

  checkMarketo = (user, done) => {
    if(!user.playground_firstaccess) {
      marketo.updateIncentive(user)
          .then((updated) => {
            if(updated) {
              user.playground_firstaccess = true
              user.save(function(err, result) {
                if(err) {
                  console.log("Error Saving Branch FirstAccess")
                }
                done(null, user);
              })
            } else {
              done(null, user);
            }
          })
    } else {
      done(null, user);
    }
  }
}
