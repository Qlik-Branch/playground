let ExampleAppList = ng.core.Component({
  selector: 'example-app-list',
  directives: [ng.router.ROUTER_DIRECTIVES],
  viewProviders: [ExampleAppService],
  templateUrl: '/views/getting-started/example-app-list.html'
})
.Class({
  constructor: [ExampleAppService, function(exampleAppService){
    exampleAppService.getExampleApps((apps)=>{
      this.apps = apps;
      this.appKeys = Object.keys(apps);
    });
  }]
})
