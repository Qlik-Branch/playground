let MyPlaygroundSampleData = ng.core.Component({
  selector: 'playground-my-playground-sample-data',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/my-playground-sample-data.html'
})
.Class({
  constructor: function(){

  }
})

MyPlaygroundSampleData = ng.router.Routes([
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
])(MyPlaygroundSampleData);
