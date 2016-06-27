var ProjectsDashboard = ng.core.Class({
  constructor: function(){
    console.log('here');
  }
})

ProjectsDashboard = ng.core.Component({
  selector: 'playground-projects-dashboard',
  directives: [ng.router.ROUTER_DIRECTIVES],
  viewProviders: [DataConnectionService, SampleDataService],
  templateUrl: '/views/projects-dashboard/projects-dashboard.html'
})(ProjectsDashboard);

ProjectsDashboard = ng.router.Routes([
  {
    path: "/",
    component: ProjectsDashboardMain
  },
  {
    path: "/sampledata",
    component: ProjectsDashboardSampleData
  },
  {
    path: "/yourdata",
    component: ProjectsDashboardYourData
  },
  {
    path: "/connect",
    component: ProjectsDashboardConnect
  },
  {
    path: '/**',
    redirectTo: ['/']
  }
])(ProjectsDashboard);
