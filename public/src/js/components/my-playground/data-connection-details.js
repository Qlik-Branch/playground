let DataConnectionDetails = ng.core.Component({
  selector: 'data-connection-details',
  directives: [ng.router.ROUTER_DIRECTIVES],
  viewProviders: [ng.router.ROUTER_PROVIDERS],
  templateUrl: '/views/my-playground/data-connection-details.html'
})
.Class({
  constructor: [ng.router.RouteSegment, DataConnectionService, function(routeSegment, dataConnectionService){
    this.routeSegment = routeSegment;
    this.connectionId = routeSegment.parameters.id;
    this.connectionDictionary = {};
    dataConnectionService.getConnectionDictionary(this.connectionId, (info)=> {
      this.connectionDictionary = info;
      console.log(info);
    });
  }],
  authorizeConnection: function(connId){
    dataConnectionService.authorizeConnection(connId, (result)=>{

    });
  }
})
