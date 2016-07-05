let SampleDataList = ng.core.Component({
  selector: 'sample-data-list',
  directives: [ng.router.ROUTER_DIRECTIVES],
  viewProviders: [],
  templateUrl: '/views/my-playground/sample-data-list.html'
})
.Class({
  constructor: [SampleDataService, function(sampleDataService){
    this.apps = {};
    this.appKeys = [];
    this.selectedApp = {};  
    sampleDataService.getSampleData((apps)=>{
      this.apps = apps;
      this.appKeys = Object.keys(apps);
      this.selectedApp = this.apps[this.appKeys[0]];
    });
  }]
})
