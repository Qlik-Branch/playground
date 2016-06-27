let DataConnectionList = ng.core.Component({
  selector: 'data-connection-list',
  directives: [ng.router.ROUTER_DIRECTIVES],
  viewProviders: [],
  templateUrl: '/views/projects-dashboard/data-connection-list.html'
})
.Class({
  constructor: [DataConnectionService, function(dataConnectionService){
    this.dataConnectionService = dataConnectionService;
    this.dataConnectionService.getDataConnections((conns)=>{
      this.conns = conns;
      this.connKeys = Object.keys(conns);
    });
  }],
  authoriseConnection: function(key){
    this.dataConnectionService.authoriseConnection(key, (response) => {
      console.log(response);
    })
  }
})
