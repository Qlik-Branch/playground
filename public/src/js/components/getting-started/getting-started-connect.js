let GettingStartedConnect = ng.core.Component({
  selector: 'playground-getting-started-connect',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/getting-started/getting-started-connect.html'
})
.Class({
  constructor: function(){

  }
})

GettingStartedConnect = ng.router.Routes([
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
])(GettingStartedConnect);
