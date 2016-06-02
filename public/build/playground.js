'use strict';

(function (playground) {

  //service declarations
  var UserService = ng.core.Injectable({}).Class({
    constructor: [ng.http.Http, function (http) {
      this.http = http;
    }],
    getUser: function getUser(callbackFn) {
      this.http.get('/api/currentuser').subscribe(function (response) {
        if (response._body !== "") {
          callbackFn(JSON.parse(response._body));
        } else {
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
  }).Class({
    constructor: [UserService, function (userService) {
      var _this = this;

      userService.getUser(function (user) {
        _this.user = user;
      });
    }]
  });

  var FooterList = ng.core.Component({
    selector: 'playground-footer-list',
    inputs: ['data: data'],
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/footer-list.html'
  }).Class({
    constructor: function constructor() {}
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
  }).Class({
    constructor: function constructor() {
      this.sites = {
        header: "Qlik Sites",
        items: [{
          text: "Qlik.com",
          link: "http://www.qlik.com"
        }, {
          text: "Qlik Community",
          link: "http://community.qlik.com"
        }, {
          text: "Qlik Cloud",
          link: "http://www.qlikcloud.com"
        }]
      };
    }
  });

  var ComingSoon = ng.core.Component({
    selector: 'coming-soon',
    template: '<div class=\'coming-soon\'>Coming Soon</div>'
  }).Class({
    constructor: function constructor() {}
  });

  var Home = ng.core.Component({
    selector: 'playground-home',
    templateUrl: '/views/home.html'
  }).Class({
    constructor: function constructor() {
      console.log('constructor');
    }
  });

  var Noobs = ng.core.Component({
    selector: 'playground-noobs',
    templateUrl: '/views/noobs.html'
  }).Class({
    constructor: function constructor() {
      console.log('constructor');
    }
  });

  var GettingStartedMain = ng.core.Component({
    selector: 'playground-getting-started-main',
    directives: [ng.router.ROUTER_DIRECTIVES, ComingSoon],
    templateUrl: '/views/getting-started/getting-started-main.html'
  }).Class({
    constructor: function constructor() {}
  });

  var GettingStartedExamples = ng.core.Component({
    selector: 'playground-getting-started-examples',
    directives: [],
    viewProviders: [],
    templateUrl: '/views/getting-started/getting-started-examples.html'
  }).Class({
    constructor: [ng.http.Http, function (http) {
      var _this2 = this;

      http.get('/api/sampleapps').subscribe(function (response) {
        _this2.apps = JSON.parse(response._body);
      });
    }]
  });

  var GettingStarted = ng.core.Class({
    constructor: function constructor() {}
  });

  GettingStarted = ng.core.Component({
    selector: 'playground-getting-started',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/getting-started/getting-started.html'
  })(GettingStarted);

  GettingStarted = ng.router.Routes([{
    path: "/exampleapps",
    component: GettingStartedExamples
  }, {
    path: "/",
    component: GettingStartedMain
  }, {
    path: '/**',
    redirectTo: ['/']
  }])(GettingStarted);

  var Showcase = ng.core.Component({
    selector: 'playground-showcase',
    templateUrl: '/views/showcase.html'
  }).Class({
    constructor: function constructor() {
      console.log('constructor');
    }
  });

  var AppComponent = function AppComponent() {};
  AppComponent.annotations = [new ng.core.Component({
    selector: 'app-component',
    directives: [ng.router.ROUTER_DIRECTIVES, Header, FooterComponent, FooterList],
    providers: [ng.router.ROUTER_PROVIDERS],
    template: '<playground-header></playground-header><router-outlet></router-outlet><playground-footer></playground-footer>'
  }), new ng.router.Routes([{
    path: "/home",
    component: Home
  }, {
    path: "/gettingstarted",
    component: GettingStarted
  }, {
    path: "/noobs",
    component: Noobs
  }, {
    path: "/showcase",
    component: Showcase
  }, {
    path: '/**',
    redirectTo: ['/home']
  }])];

  document.addEventListener('DOMContentLoaded', function () {
    ng.platformBrowserDynamic.bootstrap(AppComponent, [ng.http.HTTP_PROVIDERS, ng.router.ROUTER_PROVIDERS, ng.core.provide(ng.common.LocationStrategy, { useClass: ng.common.PathLocationStrategy })]);
  });
})(window.playground || (window.playground = {}));
