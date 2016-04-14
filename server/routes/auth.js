var express = require('express'),
    router = express.Router(),
    passport = require('passport');

router.get('/github', passport.authenticate('github'), function(req, res){
});

router.get('/github/callback', function(req, res) {  
  res.redirect('/');
});

module.exports = router;
