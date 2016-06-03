let ExampleAppDetails = ng.core.Component({
  selector: 'example-app-details',
  directives: [CloneInfo],
  viewProviders: [ng.router.ROUTER_PROVIDERS, ExampleAppService],
  templateUrl: '/views/getting-started/example-app-details.html'
})
.Class({
  constructor: [ng.router.RouteSegment, ExampleAppService, function(routeSegment, exampleAppService){
    this.routeSegment = routeSegment;
    this.appId = routeSegment.parameters.id;
    this.selectedApp = {};
    this.sampleProjects = [];
    this.selectedProject = {};
    exampleAppService.getExampleApps((apps)=>{
      this.selectedApp = apps[this.appId];
      this.config = JSON.stringify(this.selectedApp.config, null, ' ');
      this.sampleProjects = this.selectedApp['sample-projects'];
      if(this.sampleProjects.length > 0){
        this.selectedProject = this.sampleProjects[0];
      }
    })
  }],
  openCloneInfo: function(projectIndex){
    this.selectedProject = this.sampleProjects[projectIndex];
    var popupElement = document.getElementById("sample_project_clone_info");
    var dialog = leonardoui.dialog({
      content: popupElement,
      shadow: true,
      closeOnEscape: false      
    });
  }
})
