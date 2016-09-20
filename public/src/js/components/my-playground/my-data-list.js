app.MyDataList = ng.core.Component({
  selector: 'my-data-list',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/my-data-list.html'
})
.Class({
  constructor: [ng.router.ActivatedRoute, app.UserService, function(route, userService){
    this.MAX_RUNNING_APPS = 3;
    this.myRunningAppCount = 0;
    //my data
    this.myConns = {};
    this.myConnKeys = [];
    //sample data
    this.apps = {};
    this.appKeys = [];
    //connect
    this.conns = {};
    this.connKeys = [];
    route.params.subscribe((route)=>{
      this.tab = route.tab;
    });
    userService.getUser(false, (user)=>{
      if(user){
        //my data
        if(user.myParsedConnections){
          this.myConns = user.myParsedConnections;
          this.myConnKeys = Object.keys(this.myConns);
        }
        if(user.runningAppCount){
          this.myRunningAppCount = user.runningAppCount;
        }
        //sample data
        this.apps = user.sampleData;
        this.appKeys = Object.keys(this.apps);
        //connect
        this.conns = user.dataConnections;
        this.connKeys = Object.keys(this.conns);
      }
    })
  }
  ]
})
