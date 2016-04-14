var express = require('express'),
    router = express.Router(),
    QRS = require('../controllers/qrs');

router.get('/sampleapps', function(req, res){
  QRS.getExampleApps(res);
});

module.exports = router;
