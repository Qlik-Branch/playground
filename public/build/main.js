(function(playground){

  //service declarations
  var UserService =
  ng.core.Injectable({
    
  })
  .Class({
    constructor: [ng.http.Http, function(http){
      this.http = http;
    }],
    getUser: function(callbackFn){
      this.http.get('/api/currentuser').subscribe(response => {
        if(response._body!==""){
          callbackFn(JSON.parse(response._body));
        }
        else{
          callbackFn();
        }
      });
    }
  });

  
  //component declarations
  var Header = ng.core.Component({
    selector: 'playground-header',
    directives: [ng.router.ROUTER_DIRECTIVES],
    providers: [UserService],
    templateUrl: '/views/header.html'
  })
  .Class({
    constructor: [UserService, function(userService){    
      userService.getUser((user) => {
        this.user = user;
      });
    }]
  });

  var FooterList = ng.core.Component({
    selector: 'playground-footer-list',
    inputs: ['data: data'],
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/footer-list.html'
  })
  .Class({
    constructor: function(){
      
    }
  });

  // var FooterComponent = function(){}
  // FooterComponent.prototype.ngOnInit = function () {
  //
  // };
  // FooterComponent.annotations = [
  //   new ng.core.Component({
  //     selector: 'playground-footer',
  //     directives: [ng.router.ROUTER_DIRECTIVES, FooterList],
  //     templateUrl: '/views/footer.html'
  //   })
  // ];

  var FooterComponent = ng.core.Component({
    selector: 'playground-footer',
    directives: [ng.router.ROUTER_DIRECTIVES, FooterList],
    templateUrl: '/views/footer.html'
  })
  .Class({
    constructor: function(){
      this.sites = {
        header: "Qlik Sites",
        items:[
          {
            text: "Qlik.com",
            link : "http://www.qlik.com"
          },
          {
            text: "Qlik Community",
            link : "http://community.qlik.com"
          },
          {
            text: "Qlik Cloud",
            link : "http://www.qlikcloud.com"
          }
        ]
      }
    }
  });

  var Home = ng.core.Component({
    selector: 'playground-home',
    templateUrl: '/views/home.html'
  })
  .Class({
    constructor: function(){
      console.log('constructor');
    }
  });

  var Noobs = ng.core.Component({
    selector: 'playground-noobs',
    templateUrl: '/views/noobs.html'
  })
  .Class({
    constructor: function(){
      console.log('constructor');
    }
  });

  var GettingStarted = ng.core.Component({
    selector: 'playground-getting-started',
    viewProviders: [ng.http.HTTP_PROVIDERS],
    templateUrl: '/views/getting-started.html'
  })
  .Class({
    constructor: [ng.http.Http, function(http){
      http.get('/api/sampleapps').subscribe(response => {
        this.apps = JSON.parse(response._body);
      });
    }]
  })

  var Showcase = ng.core.Component({
    selector: 'playground-showcase',
    templateUrl: '/views/showcase.html'
  })
  .Class({
    constructor: function(){
      console.log('constructor');
    }
  });


  var AppComponent = function(){};
  AppComponent.annotations = [
    new ng.core.Component({
      selector: 'app-component',
      directives: [ng.router.ROUTER_DIRECTIVES, Header, FooterComponent, FooterList],
      providers: [ng.router.ROUTER_PROVIDERS],
      template: '<playground-header></playground-header><router-outlet></router-outlet><playground-footer></playground-footer>'
    }),
    new ng.router.Routes([
      {
        path: "/home",
        component: Home
      },
      {
        path: "/gettingstarted",
        component: GettingStarted
      },
      {
        path: "/noobs",
        component: Noobs
      },
      {
        path: "/showcase",
        component: Showcase
      },
      {
        path: '/**',
        redirectTo: ['/home']
      }
    ])
  ];


  document.addEventListener('DOMContentLoaded', function(){
    ng.platformBrowserDynamic.bootstrap(AppComponent, [ng.http.HTTP_PROVIDERS, ng.router.ROUTER_PROVIDERS, ng.core.provide(ng.common.LocationStrategy, { useClass: ng.common.PathLocationStrategy })]);
  });

})(window.playground || (window.playground = {}));
