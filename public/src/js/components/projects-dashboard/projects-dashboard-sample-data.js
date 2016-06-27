let ProjectsDashboardSampleData = ng.core.Component({
  selector: 'playground-projects-dashboard-sample-data',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/projects-dashboard/projects-dashboard-sample-data.html'
})
.Class({
  constructor: function(){

  }
})

ProjectsDashboardSampleData = ng.router.Routes([
  {
    path: "/",
    component: SampleDataList
  },
  {
    path: "/:id",
    component: SampleDataDetails
  },
  {
    path: '/**',
    redirectTo: ['/']
  }
])(ProjectsDashboardSampleData);
