let DataConnectionList = ng.core.Component({
  selector: 'data-connection-list',
  directives: [ng.router.ROUTER_DIRECTIVES],
  viewProviders: [],
  templateUrl: '/views/getting-started/data-connection-list.html'
})
.Class({
  constructor: [DataConnectionService, function(dataConnectionService){
    dataConnectionService.getDataConnections((conns)=>{
      this.conns = conns;
      this.connKeys = Object.keys(conns);
    });
  }]
})
