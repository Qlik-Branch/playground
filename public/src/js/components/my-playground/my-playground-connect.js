let MyPlaygroundConnect = ng.core.Component({
  selector: 'playground-my-playground-connect',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/my-playground-connect.html'
})
.Class({
  constructor: function(){

  }
})

MyPlaygroundConnect = ng.router.Routes([
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
])(MyPlaygroundConnect);
