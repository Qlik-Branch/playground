app.MyPlaygroundConnect = ng.core.Component({
  selector: 'playground-my-playground-connect',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/my-playground-connect.html'
})
.Class({
  constructor: [app.UserService, function(userService){
    this.conns;
    this.connKeys;
    userService.getUser(false, (user)=>{
      this.conns = user.dataConnections;
      this.connKeys = Object.keys(this.conns);
    })
  }]
})
