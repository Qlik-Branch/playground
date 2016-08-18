var express = require('express'),
    router = express.Router(),
    showcaseProjects = require('../configs/showcase-projects');

router.get("/:id", function(req, res){
  switch (req.params.id) {
    case "untappd":
      res.sendFile(process.env.appRoot+"/public/views/showcase/untappd-dashboard/index.html");
      break;
    default:

  }
})

module.exports = router;
