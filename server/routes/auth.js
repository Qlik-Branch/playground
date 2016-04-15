var express = require('express'),
    router = express.Router(),
    passport = require('passport'),
    mongoHelper = require('../controllers/mongo-helper'),
    QRS = require('../controllers/qrs');

router.get('/github', passport.authenticate('github'), function(req, res, next){
});

router.get('/github/callback', passport.authenticate('github'), function(req, res, next) {
  if(req.user){
    mongoHelper.checkAPIKey(req.user.username, "playground", function(err, data){
      if(err){
        ////do something with the error
      }
      else{
        if(data && data.length > 0){
          //we have a key
          res.redirect('/');
        }
        else{
          mongoHelper.createAPIKey(req.user.username, "playground", function(err, key){
            res.redirect('/');
          });
        }
      }
    });
  }
  else{
    ////we have no user so we should do something here
    res.redirect('/');
  }
});

router.get('/apikey', function(req, res){
  console.log("here at least");
  QRS.getTicket(req, res);
});

module.exports = router;
