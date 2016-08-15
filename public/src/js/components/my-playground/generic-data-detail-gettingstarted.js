app.GenericDataDetailGettingStarted = ng.core.Component({
  selector: 'playground-my-playground-generic-data-detail-gettingstarted',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/generic-data-detail-gettingstarted.html'
})
.Class({
  constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function(route, userService, dataConnectionService){
    this.dataConnectionService = dataConnectionService;
    let connectionId = route.parent.url.value[0].path;
    this.connectionConfig;
    this.getConnectionInfo(connectionId);
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
    }
    var connInfoStr = JSON.stringify(info);
    //dirty method for styling text and removing quotes (required so that the capability api reads the properties correctly)
    connInfoStr = connInfoStr.replace(/\{/gim, '{\n\t')
                             .replace(/,/gim, ',\n\t')
                             .replace(/\}/gim, '\n}');
    var connStrComponents = connInfoStr.split(",");
    var parsedComponents=[];
    for(var i=0;i<connStrComponents.length;i++){
      var keyVal = connStrComponents[i].split(":");
      parsedComponents.push(keyVal[0].replace(/\"/gim, '')+':'+keyVal[1]);
    }
    connInfoStr = parsedComponents.join(",");
    this.connectionConfig = connInfoStr.trim();
    setTimeout(function(){
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
    }, 100);
  }
})
