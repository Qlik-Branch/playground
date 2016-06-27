let ProjectsDashboardYourData = ng.core.Component({
  selector: 'playground-projects-dashboard-your-data',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/projects-dashboard/projects-dashboard-your-data.html'
})
.Class({
  constructor: function(){

  }
})

ProjectsDashboardYourData = ng.router.Routes([
  {
    path: "/",
    component: YourDataList
  },
  {
    path: "/:id",
    component: YourDataDetails
  },
  {
    path: '/**',
    redirectTo: ['/']
  }
])(ProjectsDashboardYourData);
