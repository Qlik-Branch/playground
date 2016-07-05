let YourDataDetails = ng.core.Component({
  selector: 'your-data-details',
  directives: [],
  viewProviders: [ng.router.ROUTER_PROVIDERS],
  templateUrl: '/views/getting-started/your-data-details.html'
})
.Class({
  constructor: [ng.router.RouteSegment, function(routeSegment){
    this.routeSegment = routeSegment;
    this.appId = routeSegment.parameters.id;
  }]
})
