app.MyDataList = ng.core.Component({
  selector: 'my-data-list',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/my-data-list.html'
})
.Class({
  constructor: [app.UserService, function(userService){
    this.MAX_RUNNING_APPS = 3;
    this.myRunningAppCount = 0;
    this.myConns;
    this.myConnKeys;
    userService.getUser(false, (user)=>{
      if(user){
        if(user.myParsedConnections){
          this.myConns = user.myParsedConnections;
          this.myConnKeys = Object.keys(this.myConns);
        }
        if(user.runningAppCount){
          this.myRunningAppCount = user.runningAppCount;
        }
      }
    })
  }
  ]
})
