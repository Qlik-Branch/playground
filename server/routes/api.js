var express = require('express'),
    router = express.Router(),
    QRS = require('../controllers/qrs');

router.get('/sampleapps', function(req, res){
  QRS.getExampleApps(res);
});

router.get('/currentuser', function(req, res){
  res.json(req.user);
});


module.exports = router;
