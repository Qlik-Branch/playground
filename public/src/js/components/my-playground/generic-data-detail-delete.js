app.GenericDataDetailDelete = ng.core.Component({
  selector: 'playground-my-playground-generic-data-detail-delete',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/generic-data-detail-delete.html'
})
.Class({
  constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function(route, userService, dataConnectionService){
    this.MAX_RUNNING_APPS = 3;
    this.myRunningAppCount = 0;
    this.dataConnectionService = dataConnectionService;
    this.connectionId = route.parent.url.value[0].path;
    this.connectionStatus = '';
    this.connectionStatusDetail = "";
    this.connection;
    this.isMyData = false;
    userService.getUser(false, (user)=>{
      if(user.myParsedConnections[this.connectionId]){
        this.isMyData = true;
        this.connection = user.myParsedConnections[this.connectionId];
      }
      else{
        this.connection = user.sampleData[this.connectionId];
      }
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
      this.connectionStatusDetail = "";
    }
  },
  deleteAppAndConnection: function(connectionId){
    this.connectionStatus = "Deleting";
    this.connectionStatusDetail = "Stopping application.";
    this.dataConnectionService.stopApp(connectionId, (connInfo)=>{
      this.connectionStatusDetail = "Deleting application.";
      this.dataConnectionService.deleteConnection(connectionId, (result)=>{
        if(result.err){
          this.connectionStatus = "Error";
          this.connectionStatusDetail = err;
        }
        else{
          window.location.pathname = "myplayground/mydata";
        }
      });
    })
  }
})
