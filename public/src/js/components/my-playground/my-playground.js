var MyPlayground = ng.core.Class({
  constructor: function(){
    console.log('here');
  }
})

MyPlayground = ng.core.Component({
  selector: 'playground-my-playground',
  directives: [ng.router.ROUTER_DIRECTIVES],  
  templateUrl: '/views/my-playground/my-playground.html'
})(MyPlayground);

MyPlayground = ng.router.Routes([
  {
    path: "/",
    component: MyPlaygroundMain
  },
  {
    path: "/sampledata",
    component: MyPlaygroundSampleData
  },
  {
    path: "/yourdata",
    component: MyPlaygroundYourData
  },
  {
    path: "/connect",
    component: MyPlaygroundConnect
  },
  {
    path: '/**',
    redirectTo: ['/']
  }
])(MyPlayground);
