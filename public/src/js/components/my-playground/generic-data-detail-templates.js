app.GenericDataDetailTemplates = ng.core.Component({
  selector: 'playground-my-playground-generic-data-detail-templates',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/generic-data-detail-templates.html'
})
.Class({
  constructor: [ng.router.ActivatedRoute, app.UserService, function(route, userService){
    let connectionId = route.parent.url.value[0].path;
    this.connection = {};
    this.sampleProjects = {};
    this.isMyData = false;
    userService.getUser(false, (user)=>{
      if(user.myParsedConnections[connectionId]){
        this.isMyData = true;
        this.connection = user.myParsedConnections[connectionId];
      }
      else{
        this.connection = user.sampleData[connectionId];
      }
      this.sampleProjects = user.sampleProjects;
    });
  }],
  copyToClipboard: function(index){
    var itemInput = document.getElementById(index+"_clone_url");
    itemInput.select();
    document.execCommand('copy');
  }
})
