var GitHubStrategy = require('passport-github').Strategy;

module.exports = function(passport){
  passport.use(new GitHubStrategy({
      clientID: process.env.githubClientId,
      clientSecret: process.env.githubClientSecret,      
      callbackURL: process.env.githubRedirectUrl
    },
    function(accessToken, refreshToken, profile, done) {
      profile.token = accessToken;
      process.nextTick(function () {
        return done(null, profile);
      });
    }
  ));
}
