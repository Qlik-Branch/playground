let ProjectsDashboardConnect = ng.core.Component({
  selector: 'playground-projects-dashboard-connect',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/projects-dashboard/projects-dashboard-connect.html'
})
.Class({
  constructor: function(){

  }
})

ProjectsDashboardConnect = ng.router.Routes([
  {
    path: "/",
    component: DataConnectionList
  },
  {
    path: "/:id",
    component: DataConnectionDetails
  },
  {
    path: '/**',
    redirectTo: ['/']
  }
])(ProjectsDashboardConnect);
