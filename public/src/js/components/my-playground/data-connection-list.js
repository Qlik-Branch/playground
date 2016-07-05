let DataConnectionList = ng.core.Component({
  selector: 'data-connection-list',
  directives: [ng.router.ROUTER_DIRECTIVES],
  viewProviders: [],
  templateUrl: '/views/my-playground/data-connection-list.html'
})
.Class({
  constructor: [UserService, DataConnectionService, function(userService, dataConnectionService){
    this.dataConnectionService = dataConnectionService;
    this.userService = userService;
    this.dataConnectionService.getDataConnections((conns)=>{
      this.conns = conns;
      this.connKeys = Object.keys(conns);
      this.userService.getUserConnections((userConns)=>{
        console.log(userConns);
        if(userConns.err){

        }
        else {
          for(let c=0;c<userConns.connections.length;c++){
            if(this.conns[userConns.connections[c].connection]){
              this.conns[userConns.connections[c].connection].authorised = true;
            }
            else{
              this.conns[userConns.connections[c].connection].authorised = false;
            }
          }
        }
      });
    });
  }],
  authoriseConnection: function(key){
    this.dataConnectionService.authoriseConnection(key, (response) => {
      console.log(response);
    })
  }
})
