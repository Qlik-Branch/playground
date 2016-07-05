let SampleDataDetails = ng.core.Component({
  selector: 'sample-data-details',
  directives: [],
  viewProviders: [ng.router.ROUTER_PROVIDERS, SampleDataService],
  templateUrl: '/views/my-playground/sample-data-details.html'
})
.Class({
  constructor: [ng.router.RouteSegment, SampleDataService, function(routeSegment, sampleDataService){
    this.routeSegment = routeSegment;
    this.appId = routeSegment.parameters.id;
    this.selectedApp = {};
    this.sampleProjects = [];
    this.selectedProject = {};
    sampleDataService.getExampleApps((apps)=>{
      this.selectedApp = apps[this.appId];
      this.config = JSON.stringify(this.selectedApp.config, null, ' ');
      this.sampleProjects = this.selectedApp['sample-projects'];
      if(this.sampleProjects.length > 0){
        this.selectedProject = this.sampleProjects[0];
      }
    })
  }],
  copyToClipboard: function(index){
    var itemInput = document.getElementById(index+"_clone_url");
    itemInput.select();
    document.execCommand('copy');
  }
})
