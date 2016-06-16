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

  var ExampleAppService = ng.core.Injectable({}).Class({
    constructor: [ng.http.Http, function (http) {
      this.http = http;
      this.exampleApps;
    }],
    getExampleApps: function getExampleApps(callbackFn) {
      var _this = this;

      if (this.exampleApps) {
        callbackFn(this.exampleApps);
      } else {
        this.http.get('/api/exampleapps').subscribe(function (response) {
          if (response._body !== "") {
            _this.exampleApps = JSON.parse(response._body);
            callbackFn(JSON.parse(response._body));
          } else {
            callbackFn();
          }
        });
      }
    }
  });

  var DataConnectionService = ng.core.Injectable({}).Class({
    constructor: [ng.http.Http, function (http) {
      this.http = http;
      this.dataConnections;
    }],
    getDataConnections: function getDataConnections(callbackFn) {
      var _this2 = this;

      if (this.dataConnections) {
        callbackFn(this.dataConnections);
      } else {
        this.http.get('/api/dataconnections').subscribe(function (response) {
          if (response._body !== "") {
            _this2.dataConnections = JSON.parse(response._body);
            callbackFn(JSON.parse(response._body));
          } else {
            callbackFn();
          }
        });
      }
    },
    getConnectionDictionary: function getConnectionDictionary(index, callbackFn) {
      var _this3 = this;

      if (this.dataConnections) {
        var dictionaryUrl = this.dataConnections[index].dictionary;
        this.http.get(dictionaryUrl).subscribe(function (response) {
          callbackFn(JSON.parse(response._body));
        });
      } else {
        this.getDataConnections(function (response) {
          var dictionaryUrl = _this3.dataConnections[index].dictionary;
          _this3.http.get(dictionaryUrl).subscribe(function (response) {
            callbackFn(JSON.parse(response._body));
          });
        });
      }
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
      var _this4 = this;

      userService.getUser(function (user) {
        _this4.user = user;
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

  var ExampleAppDetails = ng.core.Component({
    selector: 'example-app-details',
    directives: [],
    viewProviders: [ng.router.ROUTER_PROVIDERS, ExampleAppService],
    templateUrl: '/views/getting-started/example-app-details.html'
  }).Class({
    constructor: [ng.router.RouteSegment, ExampleAppService, function (routeSegment, exampleAppService) {
      var _this5 = this;

      this.routeSegment = routeSegment;
      this.appId = routeSegment.parameters.id;
      this.selectedApp = {};
      this.sampleProjects = [];
      this.selectedProject = {};
      exampleAppService.getExampleApps(function (apps) {
        _this5.selectedApp = apps[_this5.appId];
        _this5.config = JSON.stringify(_this5.selectedApp.config, null, ' ');
        _this5.sampleProjects = _this5.selectedApp['sample-projects'];
        if (_this5.sampleProjects.length > 0) {
          _this5.selectedProject = _this5.sampleProjects[0];
        }
      });
    }],
    copyToClipboard: function copyToClipboard(index) {
      var itemInput = document.getElementById(index + "_clone_url");
      itemInput.select();
      document.execCommand('copy');
    }
  });

  var ExampleAppList = ng.core.Component({
    selector: 'example-app-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [ExampleAppService],
    templateUrl: '/views/getting-started/example-app-list.html'
  }).Class({
    constructor: [ExampleAppService, function (exampleAppService) {
      var _this6 = this;

      exampleAppService.getExampleApps(function (apps) {
        _this6.apps = apps;
        _this6.appKeys = Object.keys(apps);
      });
    }]
  });

  var DataConnectionDetails = ng.core.Component({
    selector: 'data-connection-details',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [ng.router.ROUTER_PROVIDERS],
    templateUrl: '/views/getting-started/data-connection-details.html'
  }).Class({
    constructor: [ng.router.RouteSegment, DataConnectionService, function (routeSegment, dataConnectionService) {
      var _this7 = this;

      this.routeSegment = routeSegment;
      this.connectionId = routeSegment.parameters.id;
      this.connectionDictionary = {};
      dataConnectionService.getConnectionDictionary(this.connectionId, function (info) {
        _this7.connectionDictionary = info;
        console.log(info);
      });
    }],
    authorizeConnection: function authorizeConnection(connId) {
      dataConnectionService.authorizeConnection(connId, function (result) {});
    }
  });

  var DataConnectionList = ng.core.Component({
    selector: 'data-connection-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [],
    templateUrl: '/views/getting-started/data-connection-list.html'
  }).Class({
    constructor: [DataConnectionService, function (dataConnectionService) {
      var _this8 = this;

      dataConnectionService.getDataConnections(function (conns) {
        _this8.conns = conns;
        _this8.connKeys = Object.keys(conns);
      });
    }]
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
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/getting-started/getting-started-examples.html'
  }).Class({
    constructor: function constructor() {}
  });

  GettingStartedExamples = ng.router.Routes([{
    path: "/",
    component: ExampleAppList
  }, {
    path: "/:id",
    component: ExampleAppDetails
  }, {
    path: '/**',
    redirectTo: ['/']
  }])(GettingStartedExamples);

  var GettingStartedConnect = ng.core.Component({
    selector: 'playground-getting-started-connect',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/getting-started/getting-started-connect.html'
  }).Class({
    constructor: function constructor() {}
  });

  GettingStartedConnect = ng.router.Routes([{
    path: "/",
    component: DataConnectionList
  }, {
    path: "/:id",
    component: DataConnectionDetails
  }, {
    path: '/**',
    redirectTo: ['/']
  }])(GettingStartedConnect);

  var GettingStarted = ng.core.Class({
    constructor: function constructor() {}
  });

  GettingStarted = ng.core.Component({
    selector: 'playground-getting-started',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [DataConnectionService],
    templateUrl: '/views/getting-started/getting-started.html'
  })(GettingStarted);

  GettingStarted = ng.router.Routes([{
    path: "/",
    component: GettingStartedMain
  }, {
    path: "/exampleapps",
    component: GettingStartedExamples
  }, {
    path: "/connect",
    component: GettingStartedConnect
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
