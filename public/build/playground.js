'use strict';

(function (playground) {

  //service declarations
  var ConfigService = ng.core.Injectable({}).Class({
    constructor: [ng.http.Http, function (http) {
      this.http = http;
    }],
    getConfigs: function getConfigs(callbackFn) {
      this.http.get('/api/configs').subscribe(function (response) {
        if (response._body !== "") {
          callbackFn(JSON.parse(response._body));
        } else {
          callbackFn();
        }
      });
    }
  });

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

  var SampleDataService = ng.core.Injectable({}).Class({
    constructor: [ng.http.Http, function (http) {
      this.http = http;
      this.sampleData;
    }],
    getSampleData: function getSampleData(callbackFn) {
      var _this = this;

      if (this.sampleData) {
        callbackFn(this.sampleData);
      } else {
        this.http.get('/api/sampledata').subscribe(function (response) {
          if (response._body !== "") {
            _this.sampleData = JSON.parse(response._body);
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
    },
    authoriseConnection: function authoriseConnection(connectionId, callbackFn) {
      this.http.post("/api/authorise/" + connectionId).subscribe(function (response) {
        callbackFn(JSON.parse(response._body));
      });
    }
  });

  //component declarations
  var Header = ng.core.Component({
    selector: 'playground-header',
    directives: [ng.router.ROUTER_DIRECTIVES],
    providers: [ConfigService, UserService],
    templateUrl: '/views/header.html'
  }).Class({
    constructor: [ConfigService, UserService, function (configService, userService) {
      var _this4 = this;

      configService.getConfigs(function (configs) {
        _this4.loginUrl = configs.loginUrl;
        _this4.returnUrl = configs.returnUrl;
      });
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

  var SampleDataDetails = ng.core.Component({
    selector: 'sample-data-details',
    directives: [],
    viewProviders: [ng.router.ROUTER_PROVIDERS, SampleDataService],
    templateUrl: '/views/projects-dashboard/sample-data-details.html'
  }).Class({
    constructor: [ng.router.RouteSegment, SampleDataService, function (routeSegment, sampleDataService) {
      var _this5 = this;

      this.routeSegment = routeSegment;
      this.appId = routeSegment.parameters.id;
      this.selectedApp = {};
      this.sampleProjects = [];
      this.selectedProject = {};
      sampleDataService.getExampleApps(function (apps) {
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

  var SampleDataList = ng.core.Component({
    selector: 'sample-data-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [],
    templateUrl: '/views/projects-dashboard/sample-data-list.html'
  }).Class({
    constructor: [SampleDataService, function (sampleDataService) {
      var _this6 = this;

      this.apps = {};
      this.appKeys = [];
      this.selectedApp = {};
      sampleDataService.getSampleData(function (apps) {
        _this6.apps = apps;
        _this6.appKeys = Object.keys(apps);
        _this6.selectedApp = _this6.apps[_this6.appKeys[0]];
      });
    }]
  });

  var YourDataDetails = ng.core.Component({
    selector: 'your-data-details',
    directives: [],
    viewProviders: [ng.router.ROUTER_PROVIDERS],
    templateUrl: '/views/getting-started/your-data-details.html'
  }).Class({
    constructor: [ng.router.RouteSegment, function (routeSegment) {
      this.routeSegment = routeSegment;
      this.appId = routeSegment.parameters.id;
    }]
  });

  var YourDataList = ng.core.Component({
    selector: 'your-data-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [],
    templateUrl: '/views/getting-started/your-data-list.html'
  }).Class({
    constructor: [function () {}]
  });

  var DataConnectionDetails = ng.core.Component({
    selector: 'data-connection-details',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [ng.router.ROUTER_PROVIDERS],
    templateUrl: '/views/projects-dashboard/data-connection-details.html'
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
    templateUrl: '/views/projects-dashboard/data-connection-list.html'
  }).Class({
    constructor: [DataConnectionService, function (dataConnectionService) {
      var _this8 = this;

      this.dataConnectionService = dataConnectionService;
      this.dataConnectionService.getDataConnections(function (conns) {
        _this8.conns = conns;
        _this8.connKeys = Object.keys(conns);
      });
    }],
    authoriseConnection: function authoriseConnection(key) {
      this.dataConnectionService.authoriseConnection(key, function (response) {
        console.log(response);
      });
    }
  });

  var ProjectsDashboardMain = ng.core.Component({
    selector: 'playground-projects-dashboard-main',
    directives: [ng.router.ROUTER_DIRECTIVES, ComingSoon],
    templateUrl: '/views/projects-dashboard/projects-dashboard-main.html'
  }).Class({
    constructor: function constructor() {}
  });

  var ProjectsDashboardSampleData = ng.core.Component({
    selector: 'playground-projects-dashboard-sample-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/projects-dashboard/projects-dashboard-sample-data.html'
  }).Class({
    constructor: function constructor() {}
  });

  ProjectsDashboardSampleData = ng.router.Routes([{
    path: "/",
    component: SampleDataList
  }, {
    path: "/:id",
    component: SampleDataDetails
  }, {
    path: '/**',
    redirectTo: ['/']
  }])(ProjectsDashboardSampleData);

  var ProjectsDashboardYourData = ng.core.Component({
    selector: 'playground-projects-dashboard-your-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/projects-dashboard/projects-dashboard-your-data.html'
  }).Class({
    constructor: function constructor() {}
  });

  ProjectsDashboardYourData = ng.router.Routes([{
    path: "/",
    component: YourDataList
  }, {
    path: "/:id",
    component: YourDataDetails
  }, {
    path: '/**',
    redirectTo: ['/']
  }])(ProjectsDashboardYourData);

  var ProjectsDashboardConnect = ng.core.Component({
    selector: 'playground-projects-dashboard-connect',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/projects-dashboard/projects-dashboard-connect.html'
  }).Class({
    constructor: function constructor() {}
  });

  ProjectsDashboardConnect = ng.router.Routes([{
    path: "/",
    component: DataConnectionList
  }, {
    path: "/:id",
    component: DataConnectionDetails
  }, {
    path: '/**',
    redirectTo: ['/']
  }])(ProjectsDashboardConnect);

  var ProjectsDashboard = ng.core.Class({
    constructor: function constructor() {
      console.log('here');
    }
  });

  ProjectsDashboard = ng.core.Component({
    selector: 'playground-projects-dashboard',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [DataConnectionService, SampleDataService],
    templateUrl: '/views/projects-dashboard/projects-dashboard.html'
  })(ProjectsDashboard);

  ProjectsDashboard = ng.router.Routes([{
    path: "/",
    component: ProjectsDashboardMain
  }, {
    path: "/sampledata",
    component: ProjectsDashboardSampleData
  }, {
    path: "/yourdata",
    component: ProjectsDashboardYourData
  }, {
    path: "/connect",
    component: ProjectsDashboardConnect
  }, {
    path: '/**',
    redirectTo: ['/']
  }])(ProjectsDashboard);

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
    path: "/projectsdashboard",
    component: ProjectsDashboard
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
