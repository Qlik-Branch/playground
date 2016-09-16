app.Learn = ng.core.Component({
  selector: 'playground-learn',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/learn/learn.html'
}).Class({
  constructor: [ng.router.ActivatedRoute, function(route){
    this.route = route;
  }],
  isPath: function(path){
    console.log('child url is');
    console.log(this.route.children[0].url.value[0]);
    return this.route.children[0].url.value[0].path == path;
  }
});
