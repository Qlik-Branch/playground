let GettingStartedExamples = ng.core.Component({
  selector: 'playground-getting-started-examples',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/getting-started/getting-started-examples.html'
})
.Class({
  constructor: function(){

  }
})

GettingStartedExamples = ng.router.Routes([
  {
    path: "/",
    component: ExampleAppList
  },
  {
    path: "/:id",
    component: ExampleAppDetails
  },
  {
    path: '/**',
    redirectTo: ['/']
  }
])(GettingStartedExamples);
