'use strict';

(function (playground) {

  //service declarations
  var ConfigService = ng.core.Injectable({}).Class({
    constructor: [ng.http.Http, function (http) {
      this.http = http;
    }],
    getConfigs: function getConfigs(callbackFn) {
      this.http.get('/server/configs').subscribe(function (response) {
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
      this.user;
    }],
    getUser: function getUser(callbackFn) {
      var _this = this;

      if (!this.user) {
        console.log('fetching user info from server');
        this.http.get('/server/currentuser').subscribe(function (response) {
          if (response._body !== "") {
            _this.user = JSON.parse(response._body);
            callbackFn(_this.user);
          } else {
            callbackFn();
          }
        });
      } else {
        callbackFn(this.user);
      }
    },
    getUserConnections: function getUserConnections(callbackFn) {
      this.http.get('/server/currentuserconnections').subscribe(function (response) {
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
      var _this2 = this;

      if (this.sampleData) {
        callbackFn(this.sampleData);
      } else {
        this.http.get('/server/sampledata').subscribe(function (response) {
          if (response._body !== "") {
            _this2.sampleData = JSON.parse(response._body);
            callbackFn(JSON.parse(response._body));
          } else {
            callbackFn();
          }
        });
      }
    },
    getSampleProjects: function getSampleProjects(callbackFn) {
      var _this3 = this;

      if (this.sampleProjects) {
        callbackFn(this.sampleProjects);
      } else {
        this.http.get('/server/sampleprojects').subscribe(function (response) {
          if (response._body !== "") {
            _this3.sampleProjects = JSON.parse(response._body);
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
      var _this4 = this;

      if (this.dataConnections) {
        callbackFn(this.dataConnections);
      } else {
        this.http.get('/server/dataconnections').subscribe(function (response) {
          if (response._body !== "") {
            _this4.dataConnections = JSON.parse(response._body);
            callbackFn(JSON.parse(response._body));
          } else {
            callbackFn();
          }
        });
      }
    },
    getConnectionInfo: function getConnectionInfo(connectionId, callbackFn) {
      this.http.get('/server/connectioninfo/' + connectionId).subscribe(function (response) {
        if (response._body !== "") {
          callbackFn(JSON.parse(response._body));
        } else {
          callbackFn();
        }
      });
    },
    getConnectionDictionary: function getConnectionDictionary(index, callbackFn) {
      var _this5 = this;

      if (this.dataConnections) {
        var dictionaryUrl = this.dataConnections[index].dictionary;
        this.http.get(dictionaryUrl).subscribe(function (response) {
          callbackFn(JSON.parse(response._body));
        });
      } else {
        this.getDataConnections(function (response) {
          var dictionaryUrl = _this5.dataConnections[index].dictionary;
          _this5.http.get(dictionaryUrl).subscribe(function (response) {
            callbackFn(JSON.parse(response._body));
          });
        });
      }
    },
    authoriseConnection: function authoriseConnection(connectionId, callbackFn) {
      this.http.post("/server/authorise/" + connectionId).subscribe(function (response) {
        callbackFn(JSON.parse(response._body));
      });
    },
    startApp: function startApp(connectionId, callbackFn) {
      this.http.get("/server/startapp/" + connectionId).subscribe(function (response) {
        callbackFn(JSON.parse(response._body));
      });
    },
    stopApp: function stopApp(connectionId, callbackFn) {
      this.http.get("/server/stopapp/" + connectionId).subscribe(function (response) {
        callbackFn(JSON.parse(response._body));
      });
    },
    reloadApp: function reloadApp(connectionId, callbackFn) {
      this.http.get("/server/reloadapp/" + connectionId).subscribe(function (response) {
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
      var _this6 = this;

      this.dialog;
      this.user;
      configService.getConfigs(function (configs) {
        _this6.loginUrl = configs.loginUrl;
        _this6.returnUrl = configs.returnUrl;
      });
      userService.getUser(function (user) {
        _this6.user = user;
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
      var _this7 = this;

      this.routeSegment = routeSegment;
      this.appId = routeSegment.parameters.id;
      this.selectedApp = {};
      this.sampleProjects = [];
      this.selectedProject = {};
      sampleDataService.getExampleApps(function (apps) {
        _this7.selectedApp = apps[_this7.appId];
        _this7.config = JSON.stringify(_this7.selectedApp.config, null, ' ');
        _this7.sampleProjects = _this7.selectedApp['sample-projects'];
        if (_this7.sampleProjects.length > 0) {
          _this7.selectedProject = _this7.sampleProjects[0];
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
      var _this8 = this;

      this.apps = {};
      this.appKeys = [];
      this.selectedApp = {};
      sampleDataService.getSampleData(function (apps) {
        _this8.apps = apps;
        _this8.appKeys = Object.keys(apps);
        _this8.selectedApp = _this8.apps[_this8.appKeys[0]];
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
      var _this9 = this;

      this.routeSegment = routeSegment;
      this.connectionId = routeSegment.parameters.id;
      this.connectionDictionary = {};
      dataConnectionService.getConnectionDictionary(this.connectionId, function (info) {
        _this9.connectionDictionary = info;
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
      var _this10 = this;

      this.dataConnectionService = dataConnectionService;
      this.userService = userService;
      this.dataConnectionService.getDataConnections(function (conns) {
        _this10.conns = conns;
        _this10.connKeys = Object.keys(conns);
        _this10.userService.getUserConnections(function (userConns) {
          console.log(userConns);
          if (userConns.err) {} else {
            for (var c = 0; c < userConns.connections.length; c++) {
              if (_this10.conns[userConns.connections[c].connection]) {
                _this10.conns[userConns.connections[c].connection].authorised = true;
              } else {
                _this10.conns[userConns.connections[c].connection].authorised = false;
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
      var _this11 = this;

      this.dataConnectionService = dataConnectionService;
      this.sampleDataService = sampleDataService;
      this.userService = userService;
      this.setActiveTab(0);
      this.isTabDetail = false;
      this.selectedItem = {};
      this.selectedItemStatus = 'Checking Status...';
      this.selectedItemStatusDetail = '';
      this.myConns;
      this.myParsedConns = {};
      this.myConnKeys;
      this.apps;
      this.appKeys;
      this.conns;
      this.connKeys;
      this.connectionInfo;
      this.sampleProjects;
      userService.getUser(function (user) {
        console.log(user);
        _this11.user = user;
      });
      this.getSampleProjects();
    }],
    getConnections: function getConnections() {
      var _this12 = this;

      if (!this.conns) {
        this.dataConnectionService.getDataConnections(function (conns) {
          _this12.conns = conns;
          _this12.connKeys = Object.keys(conns);
          _this12.getMyConnections(function (userConns) {
            if (userConns.err) {} else {
              for (var c = 0; c < userConns.connections.length; c++) {
                if (_this12.conns[userConns.connections[c].connection]) {
                  _this12.conns[userConns.connections[c].connection].authorised = true;
                  _this12.myParsedConns[userConns.connections[c].connection] = _this12.conns[userConns.connections[c].connection];
                } else {
                  _this12.conns[userConns.connections[c].connection].authorised = false;
                }
              }
              _this12.myConnKeys = Object.keys(_this12.myParsedConns);
            }
          });
        });
      }
    },
    getMyConnections: function getMyConnections(callbackFn) {
      var _this13 = this;

      if (this.myConns) {
        if (callbackFn) {
          callbackFn(this.myConns);
        }
      } else {
        this.userService.getUserConnections(function (userConns) {
          _this13.myConns = userConns;
          if (callbackFn) {
            callbackFn(_this13.myConns);
          }
        });
      }
    },
    getConnectionInfo: function getConnectionInfo(connectionId) {
      var _this14 = this;

      this.dataConnectionService.getConnectionInfo(connectionId, function (connInfo) {
        _this14.onConnectionInfo(connInfo);
      });
    },
    onConnectionInfo: function onConnectionInfo(info) {
      if (info.appname) {
        this.selectedItemStatus = "Started";
      } else {
        this.selectedItemStatus = "Stopped";
        this.selectedItemDetail = "Please start the application to see more options.";
      }
      this.connectionInfo = JSON.stringify(info);
    },
    getSampleData: function getSampleData() {
      var _this15 = this;

      if (!this.apps) {
        this.sampleDataService.getSampleData(function (apps) {
          _this15.apps = apps;
          _this15.appKeys = Object.keys(apps);
        });
      }
    },
    getSampleProjects: function getSampleProjects() {
      var _this16 = this;

      if (!this.sampleProjects) {
        this.sampleDataService.getSampleProjects(function (projects) {
          console.log(projects);
          _this16.sampleProjects = projects;
        });
      }
    },
    setActiveTab: function setActiveTab(index) {
      this.activeTab = index;
      this.isTabDetail = false;
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
          this.getConnectionInfo(key);
          break;
        default:
        case "sampledata":
          this.selectedItem = this.apps[key];
          this.isTabDetail = true;
          this.getConnectionInfo(key);
          break;
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
    },
    startApp: function startApp(connectionId) {
      var _this17 = this;

      this.selectedItemStatus = "Starting";
      this.selectedItemDetail = "Starting application.";
      this.dataConnectionService.startApp(connectionId, function (connInfo) {
        _this17.onConnectionInfo(connInfo);
      });
    },
    stopApp: function stopApp(connectionId) {
      var _this18 = this;

      this.selectedItemStatus = "Stopping";
      this.selectedItemDetail = "Stopping application.";
      this.dataConnectionService.stopApp(connectionId, function (connInfo) {
        _this18.onConnectionInfo(connInfo);
      });
    },
    reloadApp: function reloadApp(connectionId) {
      var _this19 = this;

      this.selectedItemStatus = "Reloading";
      this.selectedItemDetail = "Reloading application.";
      this.dataConnectionService.reloadApp(connectionId, function (connInfo) {
        _this19.onConnectionInfo(connInfo);
      });
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
    viewProviders: [UserService, DataConnectionService, SampleDataService],
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
