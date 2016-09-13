var express = require('express'),
    router = express.Router(),
    showcaseProjects = require('../configs/showcase-projects');

router.get("/:id/:page", function(req, res){
  switch (req.params.id) {
    case "untappd":
      res.sendFile(process.env.appRoot+"/public/views/showcase/untappd-dashboard/"+req.params.page);
      break;
    case "airBnB-app":
      res.sendFile(process.env.appRoot+"/public/views/showcase/airBnB-app/"+req.params.page);
      break;
    default:

  }
})

module.exports = router;
