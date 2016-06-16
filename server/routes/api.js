var express = require('express'),
    router = express.Router(),
    exampleApps = require('../configs/example-apps'),
    dataConnections = require('../configs/data-connections');

router.get('/exampleapps', function(req, res){
  res.json(exampleApps);
});

router.get('/dataconnections', function(req, res){
  res.json(dataConnections);
});

router.get('/currentuser', function(req, res){
  res.json(req.user);
});


module.exports = router;
