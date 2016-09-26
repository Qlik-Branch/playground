var express = require('express'),
    router = express.Router(),
    showcaseProjects = require('../configs/showcase-projects');

router.get("/:id/:page", function(req, res){
  switch (req.params.id) {
    case "untappd":
      res.sendFile(process.env.appRoot+"/public/views/showcase/untappd-dashboard/"+req.params.page);
      break;
    case "playground-walkingdead":
      res.sendFile(process.env.appRoot+"/public/views/showcase/playground-walkingdead/"+req.params.page);
      break;
    case "playground-beer":
      res.sendFile(process.env.appRoot+"/public/views/showcase/playground-beer/"+req.params.page);
      break;
    case "airBnB-booze":
      res.sendFile(process.env.appRoot+"/public/views/showcase/airBnB-booze/"+req.params.page);
      break;
    case "pokemonApp":
      res.sendFile(process.env.appRoot+"/public/views/showcase/pokemonApp/"+req.params.page);
      break;
    case "airBnBApp":
      res.sendFile(process.env.appRoot+"/public/views/showcase/airBnBApp/"+req.params.page);
      break;
    default:

  }
})

module.exports = router;
