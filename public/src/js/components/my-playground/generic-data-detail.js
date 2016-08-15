app.GenericDataDetail = ng.core.Component({
  selector: 'playground-my-playground-generic-data-detail',
  directives: [ng.router.ROUTER_DIRECTIVES, ng.common.NgClass],
  templateUrl: '/views/my-playground/generic-data-detail.html'
})
.Class({
  constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function(route, userService, dataConnectionService){
    this.MAX_RUNNING_APPS = 3;
    this.myRunningAppCount = 0;
    this.dataConnectionService = dataConnectionService;
    let connectionId = route.url.value[0].path;
    this.parentPath = route.parent.url.value[0].path;
    this.connection = {};
    this.isMyData = false;
    userService.getUser(false, (user)=>{
      this.myRunningAppCount = user.runningAppCount;
      if(user.myParsedConnections[connectionId]){
        this.isMyData = true;
        this.connection = user.myParsedConnections[connectionId];
      }
      else{
        this.connectionStatus = "Started";
        this.connection = user.sampleData[connectionId];
      }
      this.getConnectionInfo(connectionId);
    });
  }],
  getConnectionInfo: function(connectionId){
    this.dataConnectionService.getConnectionInfo(connectionId, (connInfo)=>{
      this.onConnectionInfo(connInfo);
    });
  },
  onConnectionInfo: function(info){
    if(info.appname){
      this.connectionStatus = "Started";
    }
    else {
      this.connectionStatus = "Stopped";
      this.connectionStatusDetail = "";
    }
  },
  startApp: function(connectionId){
    this.connectionStatus = "Starting";
    this.connectionStatusDetail = "Starting application.";
    this.dataConnectionService.startApp(connectionId, (connInfo)=>{
      this.getConnectionInfo(connectionId);
    })
  },
  stopApp: function(connectionId){
    this.connectionStatus = "Stopping";
    this.connectionStatusDetail = "Stopping application.";
    this.dataConnectionService.stopApp(connectionId, (connInfo)=>{
      this.getConnectionInfo(connectionId);
    })
  },
  reloadApp: function(connectionId){
    this.connectionStatus = "Reloading";
    this.connectionStatusDetail = "Reloading application.";
    this.dataConnectionService.reloadApp(connectionId, (connInfo)=>{
      this.getConnectionInfo(connectionId);
    })
  }
})
