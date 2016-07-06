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
    },
    getUserConnections: function getUserConnections(callbackFn) {
      this.http.get('/api/currentuserconnections').subscribe(function (response) {
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
      this.sampleProjects;
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
    },
    getSampleProjects: function getSampleProjects(callbackFn) {
      var _this2 = this;

      if (this.sampleProjects) {
        callbackFn(this.sampleProjects);
      } else {
        this.http.get('/api/sampleprojects').subscribe(function (response) {
          if (response._body !== "") {
            _this2.sampleProjects = JSON.parse(response._body);
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
      var _this3 = this;

      if (this.dataConnections) {
        callbackFn(this.dataConnections);
      } else {
        this.http.get('/api/dataconnections').subscribe(function (response) {
          if (response._body !== "") {
            _this3.dataConnections = JSON.parse(response._body);
            callbackFn(JSON.parse(response._body));
          } else {
            callbackFn();
          }
        });
      }
    },
    getConnectionDictionary: function getConnectionDictionary(index, callbackFn) {
      var _this4 = this;

      if (this.dataConnections) {
        var dictionaryUrl = this.dataConnections[index].dictionary;
        this.http.get(dictionaryUrl).subscribe(function (response) {
          callbackFn(JSON.parse(response._body));
        });
      } else {
        this.getDataConnections(function (response) {
          var dictionaryUrl = _this4.dataConnections[index].dictionary;
          _this4.http.get(dictionaryUrl).subscribe(function (response) {
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
      var _this5 = this;

      this.dialog;
      this.user;
      this.apiKey;
      configService.getConfigs(function (configs) {
        _this5.loginUrl = configs.loginUrl;
        _this5.returnUrl = configs.returnUrl;
      });
      userService.getUser(function (user) {
        _this5.user = user.user;
        _this5.apiKey = user.apiKey;
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
    templateUrl: '/views/my-playground/sample-data-details.html'
  }).Class({
    constructor: [ng.router.RouteSegment, SampleDataService, function (routeSegment, sampleDataService) {
      var _this6 = this;

      this.routeSegment = routeSegment;
      this.appId = routeSegment.parameters.id;
      this.selectedApp = {};
      this.sampleProjects = [];
      this.selectedProject = {};
      sampleDataService.getExampleApps(function (apps) {
        _this6.selectedApp = apps[_this6.appId];
        _this6.config = JSON.stringify(_this6.selectedApp.config, null, ' ');
        _this6.sampleProjects = _this6.selectedApp['sample-projects'];
        if (_this6.sampleProjects.length > 0) {
          _this6.selectedProject = _this6.sampleProjects[0];
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
    templateUrl: '/views/my-playground/sample-data-list.html'
  }).Class({
    constructor: [SampleDataService, function (sampleDataService) {
      var _this7 = this;

      this.apps = {};
      this.appKeys = [];
      this.selectedApp = {};
      sampleDataService.getSampleData(function (apps) {
        _this7.apps = apps;
        _this7.appKeys = Object.keys(apps);
        _this7.selectedApp = _this7.apps[_this7.appKeys[0]];
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
    templateUrl: '/views/my-playground/data-connection-details.html'
  }).Class({
    constructor: [ng.router.RouteSegment, DataConnectionService, function (routeSegment, dataConnectionService) {
      var _this8 = this;

      this.routeSegment = routeSegment;
      this.connectionId = routeSegment.parameters.id;
      this.connectionDictionary = {};
      dataConnectionService.getConnectionDictionary(this.connectionId, function (info) {
        _this8.connectionDictionary = info;
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
    templateUrl: '/views/my-playground/data-connection-list.html'
  }).Class({
    constructor: [UserService, DataConnectionService, function (userService, dataConnectionService) {
      var _this9 = this;

      this.dataConnectionService = dataConnectionService;
      this.userService = userService;
      this.dataConnectionService.getDataConnections(function (conns) {
        _this9.conns = conns;
        _this9.connKeys = Object.keys(conns);
        _this9.userService.getUserConnections(function (userConns) {
          console.log(userConns);
          if (userConns.err) {} else {
            for (var c = 0; c < userConns.connections.length; c++) {
              if (_this9.conns[userConns.connections[c].connection]) {
                _this9.conns[userConns.connections[c].connection].authorised = true;
              } else {
                _this9.conns[userConns.connections[c].connection].authorised = false;
              }
            }
          }
        });
      });
    }],
    authoriseConnection: function authoriseConnection(key) {
      this.dataConnectionService.authoriseConnection(key, function (response) {
        console.log(response);
      });
    }
  });

  var MyPlaygroundMain = ng.core.Component({
    selector: 'playground-my-playground-main',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-main.html'
  }).Class({
    constructor: [UserService, DataConnectionService, SampleDataService, function (userService, dataConnectionService, sampleDataService) {
      var _this10 = this;

      this.dataConnectionService = dataConnectionService;
      this.sampleDataService = sampleDataService;
      this.userService = userService;
      this.setActiveTab(0);
      this.isTabDetail = false;
      this.selectedItem = {};
      this.myConns;
      this.myParsedConns = {};
      this.myConnKeys;
      this.apps;
      this.appKeys;
      this.conns;
      this.connKeys;
      this.sampleProjects;
      userService.getUser(function (user) {
        console.log(user);
        _this10.user = user.user;
        _this10.apiKey = user.apiKey;
      });
      this.getSampleProjects();
    }],
    getConnections: function getConnections() {
      var _this11 = this;

      if (!this.conns) {
        this.dataConnectionService.getDataConnections(function (conns) {
          _this11.conns = conns;
          _this11.connKeys = Object.keys(conns);
          _this11.getMyConnections(function (userConns) {
            if (userConns.err) {} else {
              for (var c = 0; c < userConns.connections.length; c++) {
                if (_this11.conns[userConns.connections[c].connection]) {
                  _this11.conns[userConns.connections[c].connection].authorised = true;
                  _this11.myParsedConns[userConns.connections[c].connection] = _this11.conns[userConns.connections[c].connection];
                } else {
                  _this11.conns[userConns.connections[c].connection].authorised = false;
                }
              }
              _this11.myConnKeys = Object.keys(_this11.myParsedConns);
            }
          });
        });
      }
    },
    getMyConnections: function getMyConnections(callbackFn) {
      var _this12 = this;

      if (this.myConns) {
        if (callbackFn) {
          callbackFn(this.myConns);
        }
      } else {
        this.userService.getUserConnections(function (userConns) {
          _this12.myConns = userConns;
          if (callbackFn) {
            callbackFn(_this12.myConns);
          }
        });
      }
    },
    getSampleData: function getSampleData() {
      var _this13 = this;

      if (!this.apps) {
        this.sampleDataService.getSampleData(function (apps) {
          _this13.apps = apps;
          _this13.appKeys = Object.keys(apps);
        });
      }
    },
    getSampleProjects: function getSampleProjects() {
      var _this14 = this;

      if (!this.sampleProjects) {
        this.sampleDataService.getSampleProjects(function (projects) {
          console.log(projects);
          _this14.sampleProjects = projects;
        });
      }
    },
    setActiveTab: function setActiveTab(index) {
      this.activeTab = index;
      switch (index) {
        case 0:
          this.getConnections();
          break;
        case 1:
          this.getSampleData();
          break;
        case 2:
          this.getConnections();
          break;
        default:

      }
    },
    showDetail: function showDetail(key, itemType) {
      switch (itemType) {
        case "connection":
          this.selectedItem = this.conns[key];
          this.isTabDetail = true;
          break;
        default:

      }
    },
    hideDetail: function hideDetail() {
      this.selectedItem = {};
      this.isTabDetail = false;
    },
    copyToClipboard: function copyToClipboard(index) {
      var itemInput = document.getElementById(index + "_clone_url");
      itemInput.select();
      document.execCommand('copy');
    }
  });

  var MyPlaygroundSampleData = ng.core.Component({
    selector: 'playground-my-playground-sample-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-sample-data.html'
  }).Class({
    constructor: function constructor() {}
  });

  MyPlaygroundSampleData = ng.router.Routes([{
    path: "/",
    component: SampleDataList
  }, {
    path: "/:id",
    component: SampleDataDetails
  }, {
    path: '/**',
    redirectTo: ['/']
  }])(MyPlaygroundSampleData);

  var MyPlaygroundYourData = ng.core.Component({
    selector: 'playground-my-playground-your-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-your-data.html'
  }).Class({
    constructor: function constructor() {}
  });

  MyPlaygroundYourData = ng.router.Routes([{
    path: "/",
    component: YourDataList
  }, {
    path: "/:id",
    component: YourDataDetails
  }, {
    path: '/**',
    redirectTo: ['/']
  }])(MyPlaygroundYourData);

  var MyPlaygroundConnect = ng.core.Component({
    selector: 'playground-my-playground-connect',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-connect.html'
  }).Class({
    constructor: function constructor() {}
  });

  MyPlaygroundConnect = ng.router.Routes([{
    path: "/",
    component: DataConnectionList
  }, {
    path: "/:id",
    component: DataConnectionDetails
  }, {
    path: '/**',
    redirectTo: ['/']
  }])(MyPlaygroundConnect);

  var MyPlayground = ng.core.Class({
    constructor: function constructor() {
      console.log('here');
    }
  });

  MyPlayground = ng.core.Component({
    selector: 'playground-my-playground',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [UserService, DataConnectionService, SampleDataService],
    templateUrl: '/views/my-playground/my-playground.html'
  })(MyPlayground);

  MyPlayground = ng.router.Routes([{
    path: "/",
    component: MyPlaygroundMain
  }, {
    path: "/sampledata",
    component: MyPlaygroundSampleData
  }, {
    path: "/yourdata",
    component: MyPlaygroundYourData
  }, {
    path: "/connect",
    component: MyPlaygroundConnect
  }, {
    path: '/**',
    redirectTo: ['/']
  }])(MyPlayground);

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
    path: "/myplayground",
    component: MyPlayground
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
