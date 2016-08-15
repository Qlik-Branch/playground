app.SampleDataList = ng.core.Component({
  selector: 'sample-data-list',
  directives: [ng.router.ROUTER_DIRECTIVES],
  viewProviders: [],
  templateUrl: '/views/my-playground/sample-data-list.html'
})
.Class({
  constructor: [app.UserService, function(userService){
    this.apps = {};
    this.appKeys = [];    
    userService.getUser(false, (user)=>{
      this.apps = user.sampleData;
      this.appKeys = Object.keys(this.apps);
    });
  }]
})
