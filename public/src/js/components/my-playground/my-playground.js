app.MyPlayground = ng.core.Component({
  selector: 'playground-my-playground',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/my-playground.html'
}).Class({
  constructor: [app.UserService, ng.router.ActivatedRoute, ng.router.Router, function (userService, route, router) {
    this.MAX_RUNNING_APPS = 3;
    this.myRunningAppCount = 0;
    this.myConns;
    this.myConnKeys;
    this.route = route;
    //title block variables
    this.title = "";
    this.description = "";
    this.tab = "";
    userService.getUser(false, (user)=>{
      if(!user.user){
        router.navigate(["/login"]);
        // window.location.pathname = "login";
      }
      if(user){
        if(user.myParsedConnections){
          this.myConns = user.myParsedConnections;
          this.myConnKeys = Object.keys(this.myConns);
        }
        if(user.runningAppCount){
          this.myRunningAppCount = user.runningAppCount;
        }
      }
      route.children[0].params.subscribe((route)=>{
        this.tab = route.tab;
        switch (route.tab) {
          case "mydata":
            this.title = "My Data";
            this.description = `
            Here is a list of your authorized connections. You can authorize as many connections as you would like but you can only have ${this.MAX_RUNNING_APPS} active at the same time.
            <br>
            <strong class="orange">Connections active (${this.myRunningAppCount} of ${this.MAX_RUNNING_APPS})</strong>
            `;
            break;
          case "sampledata":
            this.title = "Sample Data";
            this.description = "Use our sample data sets below to create your own projects or use one of our templates.";
            break;
          case "connect":
            this.title = "Connect";
            this.description = "Want to create projects using your own data? Below are some connections which you can use.";
            break;
          default:

        }
      });
    })
  }]
});
