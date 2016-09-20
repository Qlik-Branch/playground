app.GenericDataDetailTemplates = ng.core.Component({
  selector: 'playground-my-playground-generic-data-detail-templates',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/generic-data-detail-templates.html'
})
.Class({
  constructor: [ng.router.ActivatedRoute, app.UserService, ng.platformBrowser.DomSanitizationService, function(route, userService, domsanService){
    this.domsanService = domsanService;
    let connectionId = route.parent.url.value[0].path;
    this.connection = {};
    this.sampleProjects = {};
    this.isMyData = false;
    var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
    this.ghdlPrefix = "github-windows";
    if(isMac){
      this.ghdlPrefix = "github-mac";
    }
    userService.getUser(false, (user)=>{
      if(user.myParsedConnections[connectionId]){
        this.isMyData = true;
        this.connection = user.myParsedConnections[connectionId];
      }
      else{
        this.connection = user.sampleData[connectionId];
      }
      this.sampleProjects = user.sampleProjects;
      this.sampleProjectKeys = Object.keys(this.sampleProjects);
      for(let p of this.sampleProjectKeys){
        this.sampleProjects[p].ghdlUrl = this.domsanService.bypassSecurityTrustUrl(`${this.ghdlPrefix}://openRepo/${this.sampleProjects[p]['github-repo']}`);
      }
    });
  }],
  copyToClipboard: function(index){
    var itemInput = document.getElementById(index+"_clone_url");
    itemInput.select();
    document.execCommand('copy');
  },
  sanitizeUrl: function(url){
    return this.domsanService.bypassSecurityTrustUrl(url);
  }
})
