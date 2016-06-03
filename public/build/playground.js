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
      if (this.exampleApps) {
        callbackFn(this.exampleApps);
      } else {
        this.http.get('/configs/example-apps.json').subscribe(function (response) {
          if (response._body !== "") {
            callbackFn(JSON.parse(response._body));
          } else {
            callbackFn();
          }
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

  var CloneInfo = ng.core.Component({
    selector: 'clone-info',
    templateUrl: '/views/clone-info.html',
    inputs: ['info']
  }).Class({
    constructor: [function () {
      this.info = null;
      this.dialog;
    }],
    show: function show(triggerElementId, popupElementId) {
      var triggerElement = document.getElementById(triggerElementId);
      var popupElement = document.getElementById(popupElementId);
      this.dialog = leonardoui.popover({
        content: popupElement,
        shadow: true,
        closeOnEscape: false,
        dock: "bottom",
        alignTo: triggerElement
      });
    },
    close: function close() {
      this.dialog.close();
      this.dialog = null;
    }
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
    directives: [CloneInfo],
    viewProviders: [ng.router.ROUTER_PROVIDERS, ExampleAppService],
    templateUrl: '/views/getting-started/example-app-details.html'
  }).Class({
    constructor: [ng.router.RouteSegment, ExampleAppService, function (routeSegment, exampleAppService) {
      var _this2 = this;

      this.routeSegment = routeSegment;
      this.appId = routeSegment.parameters.id;
      this.selectedApp = {};
      this.sampleProjects = [];
      this.selectedProject = {};
      exampleAppService.getExampleApps(function (apps) {
        _this2.selectedApp = apps[_this2.appId];
        _this2.config = JSON.stringify(_this2.selectedApp.config, null, ' ');
        _this2.sampleProjects = _this2.selectedApp['sample-projects'];
        if (_this2.sampleProjects.length > 0) {
          _this2.selectedProject = _this2.sampleProjects[0];
        }
      });
    }],
    openCloneInfo: function openCloneInfo(projectIndex) {
      this.selectedProject = this.sampleProjects[projectIndex];
      var popupElement = document.getElementById("sample_project_clone_info");
      var dialog = leonardoui.dialog({
        content: popupElement,
        shadow: true,
        closeOnEscape: false
      });
    }
  });

  var ExampleAppList = ng.core.Component({
    selector: 'example-app-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [ExampleAppService],
    templateUrl: '/views/getting-started/example-app-list.html'
  }).Class({
    constructor: [ExampleAppService, function (exampleAppService) {
      var _this3 = this;

      exampleAppService.getExampleApps(function (apps) {
        _this3.apps = apps;
        _this3.appKeys = Object.keys(apps);
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

  var GettingStarted = ng.core.Class({
    constructor: function constructor() {}
  });

  GettingStarted = ng.core.Component({
    selector: 'playground-getting-started',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/getting-started/getting-started.html'
  })(GettingStarted);

  GettingStarted = ng.router.Routes([{
    path: "/",
    component: GettingStartedMain
  }, {
    path: "/exampleapps",
    component: GettingStartedExamples
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
