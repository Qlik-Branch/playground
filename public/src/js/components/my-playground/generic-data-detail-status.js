app.GenericDataDetailStatus = ng.core.Component({
  selector: 'playground-my-playground-generic-data-detail-status',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/generic-data-detail-status.html'
})
.Class({
  constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function(route, userService, dataConnectionService){
    this.MAX_RUNNING_APPS = 3;
    this.myRunningAppCount = 0;
    this.dataConnectionService = dataConnectionService;
    this.connectionId = route.parent.url.value[0].path;
    this.connectionStatus = 'Checking Status...';
    this.connectionStatusDetail = "";
    userService.getUser(false, (user)=>{
      this.myRunningAppCount = user.runningAppCount;
      this.getConnectionInfo(this.connectionId);
    });
  }],
  getConnectionInfo: function(connectionId){
    this.dataConnectionService.getConnectionInfo(connectionId, (connInfo)=>{
      this.onConnectionInfo(connInfo);
    });
  },
  onConnectionInfo: function(info){
    if(info.appname){
      this.connectionStatus = "Running";
    }
    else {
      this.connectionStatus = "Stopped";
      this.connectionStatusDetail = "Please start the application to see more options.";
    }
  }
})
