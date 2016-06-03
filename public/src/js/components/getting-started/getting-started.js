var GettingStarted = ng.core.Class({
  constructor: function(){

  }
})

GettingStarted = ng.core.Component({
  selector: 'playground-getting-started',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/getting-started/getting-started.html'
})(GettingStarted);

GettingStarted = ng.router.Routes([
  {
    path: "/",
    component: GettingStartedMain
  },  
  {
    path: "/exampleapps",
    component: GettingStartedExamples
  },
  {
    path: '/**',
    redirectTo: ['/']
  }
])(GettingStarted);
