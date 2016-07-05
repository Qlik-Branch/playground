let MyPlaygroundYourData = ng.core.Component({
  selector: 'playground-my-playground-your-data',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/my-playground-your-data.html'
})
.Class({
  constructor: function(){

  }
})

MyPlaygroundYourData = ng.router.Routes([
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
])(MyPlaygroundYourData);
