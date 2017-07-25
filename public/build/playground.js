'use strict';

(function (app) {

  // //service declarations
  app.ResourceCenterService = ng.core.Injectable({}).Class({
    constructor: [ng.http.Http, function (http) {
      this.http = http;
    }],
    getResource: function getResource(id, callbackFn) {
      this.http.get('/server/resource/' + id).subscribe(function (response) {
        if (response._body !== "") {
          callbackFn(JSON.parse(response._body));
        } else {
          callbackFn();
        }
      });
    }
  });

  app.DataConnectionService = ng.core.Injectable({}).Class({
    constructor: [ng.http.Http, function (http) {
      this.http = http;
      this.data;
      this.showcaseItems;
    }],
    getDataConnections: function getDataConnections(force, callbackFn) {
      var _this = this;

      if (!this.data || force === true) {
        this.http.get('/server/dataconnections').subscribe(function (response) {
          if (response._body !== "") {
            response = JSON.parse(response._body);
            _this.data = response;
            callbackFn(_this.data);
          } else {
            callbackFn();
          }
        });
      } else {
        callbackFn(this.data);
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
    getShowcaseItems: function getShowcaseItems(callbackFn) {
      var _this2 = this;

      if (!this.showcaseItems) {
        this.http.get("/server/showcaseitems").subscribe(function (response) {
          _this2.showcaseitems = JSON.parse(response._body);
          callbackFn(_this2.showcaseitems);
        });
      } else {
        callbackFn(this.showcaseItems);
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
    },
    deleteConnection: function deleteConnection(connectionId, callbackFn) {
      this.http.get("/server/deleteconnection/" + connectionId).subscribe(function (response) {
        callbackFn(JSON.parse(response._body));
      });
    }

  });

  app.UserService = ng.core.Injectable({}).Class({
    constructor: [ng.http.Http, function (http) {
      this.http = http;
      this.user;
    }],
    playgroundVisited: function playgroundVisited(callbackFn) {
      var _this3 = this;

      this.http.get('/server/visited').subscribe(function (response) {
        if (response._body !== "") {
          response = JSON.parse(response._body);
          if (response.success === true) {
            _this3.user.user.playground_first_visited = new Date();
          }
          callbackFn(response.success);
        } else {
          callbackFn(false);
        }
      });
    },
    getUser: function getUser(force, callbackFn) {
      var _this4 = this;

      if (!this.user || force === true) {
        console.log('fetching user info from server');
        this.http.get('/server/currentuser').subscribe(function (response) {
          if (response._body !== "") {
            response = JSON.parse(response._body);
            _this4.user = response;
            if (response.user) {
              _this4.parseConnections();
            }
            callbackFn(_this4.user);
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
    },
    parseConnections: function parseConnections(callbackFn) {
      this.user.myParsedConnections = {};
      this.user.runningAppCount = 0;
      for (var c = 0; c < this.user.myConnections.length; c++) {
        if (this.user.dataConnections[this.user.myConnections[c].connection]) {
          this.user.dataConnections[this.user.myConnections[c].connection].authorised = true;
          this.user.myParsedConnections[this.user.myConnections[c].connection] = this.user.dataConnections[this.user.myConnections[c].connection];
          if (this.user.myConnections[c].appid) {
            this.user.myParsedConnections[this.user.myConnections[c].connection].appid = this.user.myConnections[c].appid;
            this.user.runningAppCount++;
          }
        } else {
          this.user.dataConnections[this.user.myConnections[c].connection].authorised = false;
        }
      }
    }
  });

  app.PubSub = ng.core.Injectable({}).Class({
    constructor: [function () {
      this.publications = {};
    }],
    subscribe: function subscribe(publication, subscriber, fn) {
      if (!this.publications[publication]) {
        this.publications[publication] = {
          subscribers: {}
        };
      }
      this.publications[publication].subscribers[subscriber] = fn;
    },
    publish: function publish(publication, params) {
      if (this.publications[publication]) {
        for (var s in this.publications[publication].subscribers) {
          this.publications[publication].subscribers[s].call(null, params);
        }
      }
    }
  });

  app.QSocksService = ng.core.Injectable({}).Class({
    constructor: [ng.http.Http, app.PubSub, function (http, pubsub) {
      this.http = http;
      this.pubsub = pubsub;
      this.currentAppId;
      this.global;
      this.app;
      this.ticket;
    }],
    connect: function connect(config, callbackFn) {
      var _this5 = this;

      if (this.currentAppId != config.appname) {
        if (this.currentAppId) {
          this.disconnect();
        }
        this.currentAppId = config.appname;
      }
      if (!this.global) {
        this.authenticate(config, function (err, ticket) {
          if (err) {
            callbackFn(err);
          } else {
            config.ticket = ticket;
            qsocks.ConnectOpenApp(config).then(function (result) {
              _this5.global = result[0];
              _this5.app = result[1];
              callbackFn(null, _this5.global, _this5.app);
            });
          }
        });
      } else {
        config.ticket = this.ticket;
        qsocks.ConnectOpenApp(config).then(function (result) {
          _this5.global = result[0];
          _this5.app = result[1];
          callbackFn(null, _this5.global, _this5.app);
        });
      }
    },
    authenticate: function authenticate(config, callbackFn) {
      this.http.get('/api/ticket?apikey=' + config.apiKey).subscribe(function (response) {
        if (response._body !== "") {
          response = JSON.parse(response._body);
          config.ticket = response.ticket;
          callbackFn(null, response.ticket);
        } else {
          console.log('error getting ticket');
          callbackFn('error getting ticket');
        }
      });
    },
    disconnect: function disconnect() {
      if (this.app && this.app.connection) {
        this.app.connection.close();
      }
    }

  });

  //
  // //main component declarations
  app.Header = ng.core.Component({
    selector: 'playground-header',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/header.html'
  }).Class({
    constructor: [app.UserService, function (userService) {
      var _this6 = this;

      this.dialog;
      this.user;
      this.loginUrl;
      this.returnUrl;
      userService.getUser(false, function (user) {
        _this6.user = user.user;
        _this6.loginUrl = user.loginUrl;
        _this6.returnUrl = user.returnUrl;
      });
    }]
  });

  // app.FooterList = ng.core.Component({
  //   selector: 'playground-footer-list',
  //   inputs: ['data:data'],
  //   directives: [ng.router.ROUTER_DIRECTIVES],
  //   templateUrl: '/views/footer-list.html'
  // })
  // .Class({
  //   constructor: function(){
  //
  //   }
  // });

  app.FooterList = function () {
    function FooterList() {}
    FooterList.data = [];
  };

  app.FooterList.annotations = [new ng.core.Component({
    selector: 'playground-footer-list',
    inputs: ['data:data'],
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/footer-list.html'
  })];

  app.FooterComponent = ng.core.Component({
    selector: 'playground-footer',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/footer.html'
  }).Class({
    constructor: function constructor() {
      this.sitesone = {
        header: "QLIK SITES",
        items: [{
          text: "Qlik.com",
          link: "http://www.qlik.com"
        }, {
          text: "Qlik Cloud",
          link: "http://www.qlikcloud.com"
        }, {
          text: "Qlik Community",
          link: "http://community.qlik.com"
        }]
      };
      this.sitestwo = {
        header: "",
        items: [{
          text: "Partner Portal",
          link: "https://login.qlik.com/login.aspx?returnURL=%2fexternal%2fportal.aspx"
        }, {
          text: "Qlik Support",
          link: "https://qliksupport.force.com/apex/QS_Home_Page"
        }]
      };
      this.sitesthree = {
        header: "",
        items: [{
          text: "Qlik Market",
          link: "http://market.qlik.com"
        }, {
          text: "Demo Site",
          link: "http://sense-demo.qlik.com"
        }]
      };
    }
  });

  app.ComingSoon = ng.core.Component({
    selector: 'coming-soon',
    template: '<div class=\'coming-soon\'>Coming Soon</div>'
  }).Class({
    constructor: function constructor() {}
  });

  app.Home = ng.core.Component({
    selector: 'playground-home',
    templateUrl: '/views/home.html'
  }).Class({
    constructor: function constructor() {
      console.log('constructor');
    }
  });

  app.Showcase = ng.core.Component({
    selector: 'playground-showcase',
    templateUrl: '/views/showcase.html'
  }).Class({
    constructor: [app.DataConnectionService, app.UserService, function (dataConnectionService, userService) {
      var _this7 = this;

      this.dataConnectionService = dataConnectionService;
      this.userService = userService;
      this.items;
      this.itemKeys;
      this.apiKey;
      this.userService.getUser(false, function (user) {
        if (user && user.user) {
          _this7.apiKey = user.user.apiKey;
        }
      });
      this.dataConnectionService.getShowcaseItems(function (items) {
        _this7.items = items;
        _this7.itemKeys = Object.keys(items);
        _this7.userService.getUserConnections(function (connections) {
          var connectionList = connections.connections;
          for (var i in _this7.items) {
            if (_this7.items[i].ownData) {
              for (var c in connectionList) {
                if (_this7.items[i].connectionId == connectionList[c].connection) {
                  if (connectionList[c].appid) {
                    _this7.items[i].canUseOwnData = true;
                    _this7.items[i].appid = connectionList[c].appid;
                  }
                  break;
                }
              }
            }
          }
        });
      });
    }]
  });

  app.Login = ng.core.Component({
    selector: 'playground-login',
    templateUrl: '/views/login.html'
  }).Class({
    constructor: [app.UserService, function (userService) {
      var _this8 = this;

      this.dialog;
      this.user;
      this.loginUrl;
      this.returnUrl;
      userService.getUser(false, function (user) {
        _this8.user = user.user;
        _this8.loginUrl = user.loginUrl;
        _this8.returnUrl = user.returnUrl;
      });
    }],
    ngOnInit: [function () {
      initInfoqBeaconForCustomer('0', 'dc09199b-7407-452e-b9e1-ec6c400f1a43');
      logData();
    }]
  });

  app.Thanks = ng.core.Component({
    selector: 'playground-thanks',
    templateUrl: '/views/thanks.html'
  }).Class({
    constructor: [app.UserService, ng.router.ActivatedRoute, ng.router.Router, function (userService, route, router) {
      var _this9 = this;

      this.trackingPixel;
      userService.getUser(false, function (user) {
        if (!user.user) {
          router.navigate(["/login"]);
        } else {
          userService.playgroundVisited(function (result) {
            if (result == null || result === false) {
              router.navigate(["/myplayground"]);
            } else {
              var axel = Math.random() + "";
              var a = axel * 10000000000000;
              _this9.trackingPixel = 'https://pubads.g.doubleclick.net/activity;xsp=212190;ord=' + a + '?';
            }
          });
        }
      });
    }],
    ngOnInit: [function () {
      initInfoqBeaconForCustomer('1', 'dc09199b-7407-452e-b9e1-ec6c400f1a43');
      logData();
    }]
  });

  app.Terms = ng.core.Component({
    selector: 'playground-terms',
    templateUrl: '/views/terms.html'
  }).Class({
    constructor: function constructor() {
      console.log('constructor');
    }
  });

  app.Learn = ng.core.Component({
    selector: 'playground-learn',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/learn/learn.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, function (route) {
      this.route = route;
    }],
    isPath: function isPath(path) {
      console.log('child url is');
      console.log(this.route.children[0].url.value[0]);
      return this.route.children[0].url.value[0].path == path;
    }
  });

  app.Noobs = ng.core.Component({
    selector: 'playground-noobs',
    templateUrl: '/views/learn/noobs.html'
  }).Class({
    constructor: [ng.core.ChangeDetectorRef, app.DataConnectionService, app.QSocksService, function (cdr, dataConnectionService, qsocksService) {
      var _this10 = this;

      this.cdr = cdr;
      this.dataConnectionService = dataConnectionService;
      this.qsocksService = qsocksService;
      this.fields = [];
      this.loading = true;
      this.connectionStatus = "Please wait...";
      this.connectionDetail = "Connecting";
      this.dataConnectionService.getConnectionInfo("noobs", function (connInfo) {
        _this10.qsocksService.connect(connInfo, function (err, global, app) {
          if (err) {
            _this10.connectionStatus = "Error!";
            _this10.connectionDetail = err;
          }
          if (app) {
            _this10.loading = false;
            _this10.fields = ["Doctor", "Patient", "Drug", "Cost"];
            _this10.cdr.detectChanges();
          }
        });
      });
    }]
  });

  app.APIContent = ng.core.Component({
    selector: 'playground-api-content',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/learn/api-content.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, app.ResourceCenterService, function (route, resourceCenterService) {
      var _this11 = this;

      this.route = route;
      this.resourceCenterService = resourceCenterService;
      this.api = this.route.parent.url.value[0].path;
      route.params.subscribe(function (route) {
        _this11.getResourceContent(route);
      });
    }],
    getResourceContent: function getResourceContent(route) {
      var _this12 = this;

      var resourceId = null;
      this.resourceTitle = "";
      this.content = "";
      switch (this.api) {
        case "engine":
          switch (route.subject) {
            case "overview":
              resourceId = "57bc65dc99eaed947c8e58c4";
              break;
            case "authenticating":
              resourceId = "57bc4c2482583d70eba9ef60";
              break;
            case "connecting":
              resourceId = "57bc6bdd99eaed947c8e5918";
              break;
            case "hypercube":
              resourceId = "57bc71b3b2f5fb393a3480d6";
              break;
            case "listobject":

              break;
            case "filtering":

              break;
            default:

          }
          break;
        case "capability":
          switch (route.subject) {
            case "overview":
              resourceId = "57b195052fe227f95f07cba4";
              break;
            case "authenticating":
              resourceId = "57bb1b4c9a9e3798414d5113";
              break;
            case "connecting":
              resourceId = "57a356c6a3c42710c3f23c1c";
              break;
            case "visualizations":
              resourceId = "57b1dd7dc3416b4035de71bc";
              break;
            case "filtering":

              break;
            default:

          }
          break;
        case "noobs":
          switch (route.subject) {
            case "noobs":
              console.log(route);
              break;
            case "engine-intro":
              resourceId = "57e03c6371a03625488569c7";
              break;
            case "api-overview":
              resourceId = "57e04f86c374290047df8b49";
              break;
            default:

          }
          break;
        default:

      }
      if (resourceId) {
        this.resourceCenterService.getResource(resourceId, function (resource) {
          resource = JSON.parse(resource);
          if (resource && resource.data && resource.data.length > 0) {
            resource = resource.data[0];
            _this12.resourceTitle = resource.title;
            console.log(resource);
            _this12.content = marked(_this12.arrayBufferToBase64(resource.content.data));
            setTimeout(function () {
              $('pre code').each(function (i, block) {
                hljs.highlightBlock(block);
              });
            }, 100);
          }
        });
      }
    },
    arrayBufferToBase64: function arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return binary;
    }
  });

  app.MyDataList = ng.core.Component({
    selector: 'my-data-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-data-list.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, function (route, userService) {
      var _this13 = this;

      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      //my data
      this.myConns = {};
      this.myConnKeys = [];
      //sample data
      this.apps = {};
      this.appKeys = [];
      //connect
      this.conns = {};
      this.connKeys = [];
      route.params.subscribe(function (route) {
        _this13.tab = route.tab;
      });
      userService.getUser(false, function (user) {
        if (user) {
          //my data
          if (user.myParsedConnections) {
            _this13.myConns = user.myParsedConnections;
            _this13.myConnKeys = Object.keys(_this13.myConns);
          }
          if (user.runningAppCount) {
            _this13.myRunningAppCount = user.runningAppCount;
          }
          //sample data
          _this13.apps = user.sampleData;
          _this13.appKeys = Object.keys(_this13.apps);
          //connect
          _this13.conns = user.dataConnections;
          _this13.connKeys = Object.keys(_this13.conns);
        }
      });
    }]
  });

  app.GenericDataDetailDelete = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail-delete',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/generic-data-detail-delete.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function (route, userService, dataConnectionService) {
      var _this14 = this;

      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      this.dataConnectionService = dataConnectionService;
      this.connectionId = route.parent.url.value[0].path;
      this.connectionStatus = '';
      this.connectionStatusDetail = "";
      this.connection;
      this.isMyData = false;
      userService.getUser(false, function (user) {
        if (user.myParsedConnections[_this14.connectionId]) {
          _this14.isMyData = true;
          _this14.connection = user.myParsedConnections[_this14.connectionId];
        } else {
          _this14.connection = user.sampleData[_this14.connectionId];
        }
        _this14.myRunningAppCount = user.runningAppCount;
        _this14.getConnectionInfo(_this14.connectionId);
      });
    }],
    getConnectionInfo: function getConnectionInfo(connectionId) {
      var _this15 = this;

      this.dataConnectionService.getConnectionInfo(connectionId, function (connInfo) {
        _this15.onConnectionInfo(connInfo);
      });
    },
    onConnectionInfo: function onConnectionInfo(info) {
      if (info.appname) {
        this.connectionStatus = "Running";
      } else {
        this.connectionStatus = "Stopped";
        this.connectionStatusDetail = "";
      }
    },
    deleteAppAndConnection: function deleteAppAndConnection(connectionId) {
      var _this16 = this;

      this.connectionStatus = "Deleting";
      this.connectionStatusDetail = "Stopping application.";
      this.dataConnectionService.stopApp(connectionId, function (connInfo) {
        _this16.connectionStatusDetail = "Deleting application.";
        _this16.dataConnectionService.deleteConnection(connectionId, function (result) {
          if (result.err) {
            _this16.connectionStatus = "Error";
            _this16.connectionStatusDetail = err;
          } else {
            window.location.pathname = "myplayground/mydata";
          }
        });
      });
    }
  });

  app.GenericDataDetailGettingStarted = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail-gettingstarted',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/generic-data-detail-gettingstarted.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function (route, userService, dataConnectionService) {
      this.dataConnectionService = dataConnectionService;
      var connectionId = route.parent.url.value[0].path;
      this.connectionConfig;
      this.getConnectionInfo(connectionId);
    }],
    getConnectionInfo: function getConnectionInfo(connectionId) {
      var _this17 = this;

      this.dataConnectionService.getConnectionInfo(connectionId, function (connInfo) {
        _this17.onConnectionInfo(connInfo);
      });
    },
    onConnectionInfo: function onConnectionInfo(info) {
      if (info.appname) {
        this.connectionStatus = "Running";
      } else {
        this.connectionStatus = "Stopped";
      }
      var connInfoStr = JSON.stringify(info);
      //dirty method for styling text and removing quotes (required so that the capability api reads the properties correctly)
      connInfoStr = connInfoStr.replace(/\{/gim, '{\n\t').replace(/,/gim, ',\n\t').replace(/\}/gim, '\n}');
      var connStrComponents = connInfoStr.split(",");
      var parsedComponents = [];
      for (var i = 0; i < connStrComponents.length; i++) {
        var keyVal = connStrComponents[i].split(":");
        parsedComponents.push(keyVal[0].replace(/\"/gim, '') + ':' + keyVal[1]);
      }
      connInfoStr = parsedComponents.join(",");
      this.connectionConfig = connInfoStr.trim();
      setTimeout(function () {
        $('pre code').each(function (i, block) {
          hljs.highlightBlock(block);
        });
      }, 100);
    }
  });

  app.GenericDataDetailFieldExplorer = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail-field-explorer',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/generic-data-detail-field-explorer.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, ng.core.ChangeDetectorRef, app.UserService, app.DataConnectionService, app.QSocksService, function (route, cdr, userService, dataConnectionService, qsocksService) {
      var _this18 = this;

      this.userService = userService;
      this.dataConnectionService = dataConnectionService;
      this.qsocksService = qsocksService;
      this.cdr = cdr;
      this.connectionStatus = "Please wait...";
      this.connectionDetail = "Connecting";
      this.connectionId = route.parent.url.value[0].path;
      this.loading = true;
      this.fields = {};
      this.fieldKeys;
      this.selectedFields = [];
      this.userService.getUser(false, function (user) {
        _this18.dataConnectionService.getConnectionInfo(_this18.connectionId, function (connInfo) {
          _this18.qsocksService.connect(connInfo, function (err, global, app) {
            if (err) {
              _this18.connectionStatus = "Error!";
              _this18.connectionDetail = err;
            }
            if (app) {
              var fieldListDef = {
                qInfo: {
                  qType: "FieldList"
                },
                qFieldListDef: {}
              };
              app.createSessionObject(fieldListDef).then(function (fieldsObject) {
                fieldsObject.getLayout().then(function (layout) {
                  _this18.loading = false;
                  layout.qFieldList.qItems.forEach(function (item, index) {
                    _this18.fields[item.qName] = { selected: false };
                  });
                  console.log(_this18.fields);
                  _this18.fieldKeys = Object.keys(_this18.fields).sort();
                  _this18.cdr.detectChanges();
                });
              });
            }
          });
        });
      });
    }],
    toggleField: function toggleField(field) {
      var fieldIndex = this.selectedFields.indexOf(field);
      if (fieldIndex == -1) {
        this.selectedFields.push(field);
      } else {
        this.selectedFields.splice(fieldIndex, 1);
      }
    }
  });

  app.GenericDataDetailTemplates = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail-templates',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/generic-data-detail-templates.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, ng.platformBrowser.DomSanitizationService, function (route, userService, domsanService) {
      var _this19 = this;

      this.domsanService = domsanService;
      var connectionId = route.parent.url.value[0].path;
      this.connection = {};
      this.sampleProjects = {};
      this.isMyData = false;
      var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      this.ghdlPrefix = "github-windows";
      if (isMac) {
        this.ghdlPrefix = "github-mac";
      }
      userService.getUser(false, function (user) {
        if (user.myParsedConnections[connectionId]) {
          _this19.isMyData = true;
          _this19.connection = user.myParsedConnections[connectionId];
        } else {
          _this19.connection = user.sampleData[connectionId];
        }
        _this19.sampleProjects = user.sampleProjects;
        _this19.sampleProjectKeys = Object.keys(_this19.sampleProjects);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = _this19.sampleProjectKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var p = _step.value;

            _this19.sampleProjects[p].ghdlUrl = _this19.domsanService.bypassSecurityTrustUrl(_this19.ghdlPrefix + '://openRepo/' + _this19.sampleProjects[p]['github-repo']);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });
    }],
    copyToClipboard: function copyToClipboard(index) {
      var itemInput = document.getElementById(index + "_clone_url");
      itemInput.select();
      document.execCommand('copy');
    },
    sanitizeUrl: function sanitizeUrl(url) {
      return this.domsanService.bypassSecurityTrustUrl(url);
    }
  });

  app.GenericDataDetail = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail',
    directives: [ng.router.ROUTER_DIRECTIVES, ng.common.NgClass],
    templateUrl: '/views/my-playground/generic-data-detail.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function (route, userService, dataConnectionService) {
      var _this20 = this;

      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      this.dataConnectionService = dataConnectionService;
      var connectionId = route.url.value[0].path;
      this.parentPath = route.parent.url.value[0].path;
      this.connection = {};
      this.isMyData = false;
      userService.getUser(false, function (user) {
        _this20.myRunningAppCount = user.runningAppCount;
        if (user.myParsedConnections[connectionId]) {
          _this20.isMyData = true;
          _this20.connection = user.myParsedConnections[connectionId];
        } else {
          _this20.connectionStatus = "Running";
          _this20.connection = user.sampleData[connectionId];
        }
        _this20.getConnectionInfo(connectionId);
      });
    }],
    getConnectionInfo: function getConnectionInfo(connectionId) {
      var _this21 = this;

      this.dataConnectionService.getConnectionInfo(connectionId, function (connInfo) {
        _this21.onConnectionInfo(connInfo);
      });
    },
    onConnectionInfo: function onConnectionInfo(info) {
      if (info.appname) {
        this.connectionStatus = "Running";
      } else {
        this.connectionStatus = "Stopped";
        this.connectionStatusDetail = "";
      }
    },
    startApp: function startApp(connectionId) {
      var _this22 = this;

      this.connectionStatus = "Starting";
      this.connectionStatusDetail = "Starting application.";
      this.dataConnectionService.startApp(connectionId, function (connInfo) {
        _this22.getConnectionInfo(connectionId);
      });
    },
    stopApp: function stopApp(connectionId) {
      var _this23 = this;

      this.connectionStatus = "Stopping";
      this.connectionStatusDetail = "Stopping application.";
      this.dataConnectionService.stopApp(connectionId, function (connInfo) {
        _this23.getConnectionInfo(connectionId);
      });
    },
    reloadApp: function reloadApp(connectionId) {
      var _this24 = this;

      this.connectionStatus = "Reloading";
      this.connectionStatusDetail = "Reloading application.";
      this.dataConnectionService.reloadApp(connectionId, function (connInfo) {
        _this24.getConnectionInfo(connectionId);
      });
    }
  });

  app.MyPlaygroundMyData = ng.core.Component({
    selector: 'playground-my-playground-my-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-my-data.html'
  }).Class({
    constructor: function constructor() {}
  });

  app.ListObject = ng.core.Component({
    selector: 'playground-vis-listobject',
    directives: [ng.router.ROUTER_DIRECTIVES],
    inputs: ['field:field'],
    templateUrl: '/views/vis/list-object.html'
  }).Class({
    constructor: [ng.core.ChangeDetectorRef, app.QSocksService, app.PubSub, function (cdr, qsocksService, pubsub) {
      this.cdr = cdr;
      this.qsocksService = qsocksService;
      this.pubsub = pubsub;
      this.field = "";
      this.listValues = [];
      this.genericObject;
    }],
    ngOnInit: function ngOnInit() {
      var _this25 = this;

      var def = {
        qInfo: {
          qType: "ListObject"
        },
        qListObjectDef: {
          qDef: {
            qFieldDefs: [//the name of the field to load
            this.field],
            qFieldLabels: [//the label we want to give the field
            this.field],
            qSortCriterias: [{
              qSortByState: 1 //we sort by state first asc
            }, {
              qSortByAscii: 1 //and then text value asc
            }]
          },
          qInitialDataFetch: [//an array of data pages we want to fetch when we first call 'getLayout()' on the list object
          {
            qTop: 0,
            qLeft: 0,
            qWidth: 1,
            qHeight: 100
          }]
        }
      };
      this.qsocksService.app.createSessionObject(def).then(function (genericObject) {
        _this25.pubsub.subscribe('update', genericObject.handle, _this25.getLayout.bind(_this25));
        _this25.pubsub.subscribe('loading', genericObject.handle, _this25.setLoading.bind(_this25));
        _this25.genericObject = genericObject;
        _this25.getLayout();
      });
    },
    clearAll: function clearAll() {},
    search: function search(field, event) {
      var _this26 = this;

      this.pubsub.publish('loading');
      if (event.keyCode === 13) {
        //confirm the search
        event.target.value = "";
        this.genericObject.acceptListObjectSearch("/qListObjectDef", true).then(function (response) {
          _this26.pubsub.publish('update');
        });
      } else if (event.keyCode === 27 || event.target.value.length == 0) {
        //cancel the search
        event.target.value = "";
        this.genericObject.abortListObjectSearch("/qListObjectDef").then(function (response) {
          _this26.pubsub.publish('update');
        });
      } else {
        if (event.target.value.length > 0) {
          this.genericObject.searchListObjectFor("/qListObjectDef", event.target.value).then(function (response) {
            _this26.pubsub.publish('update');
          });
        } else {
          this.genericObject.abortListObjectSearch("/qListObjectDef").then(function (response) {
            _this26.pubsub.publish('update');
          });
        }
      }
      console.log('searching');
    },
    clearSearch: function clearSearch(field, event) {
      var _this27 = this;

      this.pubsub.publish('loading');
      var inputEl = document.getElementById(field + "_search_input");
      if (inputEl) {
        inputEl.value = "";
        this.genericObject.abortListObjectSearch("/qListObjectDef").then(function (response) {
          _this27.pubsub.publish('update');
        });
      }
    },
    clearFieldSelections: function clearFieldSelections() {
      var _this28 = this;

      this.pubsub.publish('loading');
      this.genericObject.clearSelections("/qListObjectDef").then(function (response) {
        _this28.pubsub.publish('update');
      });
    },
    setLoading: function setLoading() {
      var loadingEl = document.getElementById(this.field + "_listbox_loading");
      if (loadingEl) {
        loadingEl.classList.add('loading');
      }
    },
    getLayout: function getLayout() {
      var _this29 = this;

      this.genericObject.getLayout().then(function (layout) {
        _this29.listValues = [];
        var matrix = layout.qListObject.qDataPages[0].qMatrix;
        matrix.forEach(function (row, index) {
          _this29.listValues.push(row[0]);
        });
        _this29.cdr.detectChanges();
        var loadingEl = document.getElementById(_this29.field + "_listbox_loading");
        if (loadingEl) {
          loadingEl.classList.remove('loading');
        }
      });
    },
    toggleValue: function toggleValue(elemNum, event) {
      var _this30 = this;

      this.pubsub.publish('loading');
      this.genericObject.selectListObjectValues("/qListObjectDef", [parseInt(elemNum)], true).then(function (response) {
        event.target.parentElement.scrollTop = 0;
        _this30.pubsub.publish('update');
      });
    }
  });

  // //my playground main component
  app.MyPlayground = ng.core.Component({
    selector: 'playground-my-playground',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground.html'
  }).Class({
    constructor: [app.UserService, ng.router.ActivatedRoute, ng.router.Router, function (userService, route, router) {
      var _this31 = this;

      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      this.myConns;
      this.myConnKeys;
      this.route = route;
      //title block variables
      this.title = "";
      this.description = "";
      this.tab = "";
      userService.getUser(false, function (user) {
        if (!user.user) {
          router.navigate(["/login"]);
          // window.location.pathname = "login";
        }
        if (user) {
          if (user.user && user.user.playground_first_visited == null) {
            router.navigate(["/thanks"]);
          }
          if (user.myParsedConnections) {
            _this31.myConns = user.myParsedConnections;
            _this31.myConnKeys = Object.keys(_this31.myConns);
          }
          if (user.runningAppCount) {
            _this31.myRunningAppCount = user.runningAppCount;
          }
        }
        route.children[0].params.subscribe(function (route) {
          _this31.tab = route.tab;
          switch (route.tab) {
            case "mydata":
              _this31.title = "My Data";
              _this31.description = '\n              Here is a list of your authorized connections. You can authorize as many connections as you would like but you can only have ' + _this31.MAX_RUNNING_APPS + ' active at the same time.\n              <br>\n              <strong class="orange">Connections active (' + _this31.myRunningAppCount + ' of ' + _this31.MAX_RUNNING_APPS + ')</strong>\n              ';
              break;
            case "sampledata":
              _this31.title = "Sample Data";
              _this31.description = "Use our sample data sets below to create your own projects or use one of our templates.";
              break;
            case "connect":
              _this31.title = "Connect";
              _this31.description = "Want to create projects using your own data? Below are some connections which you can use.";
              break;
            default:

          }
        });
      });
    }]
  });

  //
  // //main routing
  var genericDataDetailRoutes = [{
    path: '',
    redirectTo: 'gettingstarted',
    pathMatch: 'full'
  }, {
    path: 'gettingstarted',
    component: app.GenericDataDetailGettingStarted
  }, {
    path: 'templates',
    component: app.GenericDataDetailTemplates
  }, {
    path: 'explorer',
    component: app.GenericDataDetailFieldExplorer
  }, {
    path: 'delete',
    component: app.GenericDataDetailDelete
  }];

  var mainRoutes = [{
    path: '',
    component: app.Home
  }, {
    path: 'learn',
    component: app.Learn,
    children: [{
      path: '',
      pathMatch: 'full',
      redirectTo: 'noobs'
    }, {
      path: 'noobs',
      children: [{
        path: '',
        pathMatch: 'full',
        redirectTo: 'intro'
      }, {
        path: 'intro',
        component: app.Noobs
      }, {
        path: ':subject',
        component: app.APIContent
      }]
    }, {
      path: 'engine',
      children: [{
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview'
      }, {
        path: ':subject',
        component: app.APIContent
      }]
    }, {
      path: 'capability',
      children: [{
        path: '',
        pathMatch: 'full',
        redirectTo: 'overview'
      }, {
        path: ':subject',
        component: app.APIContent
      }]
    }]
  }, {
    path: 'myplayground',
    component: app.MyPlayground,
    children: [{
      path: '',
      pathMatch: 'full',
      redirectTo: 'mydata'
    }, {
      path: ':tab',
      component: app.MyPlaygroundMyData,
      children: [{
        path: '',
        component: app.MyDataList
      }, {
        path: ':id',
        component: app.GenericDataDetail,
        children: genericDataDetailRoutes
      }]
    }, {
      path: 'sampledata',
      component: app.MyPlaygroundSampleData,
      children: [{
        path: '',
        component: app.SampleDataList
      }, {
        path: ':id',
        component: app.GenericDataDetail,
        children: genericDataDetailRoutes
      }]
    }, {
      path: 'connect',
      component: app.MyPlaygroundConnect
    }]
  }, {
    path: "showcase",
    component: app.Showcase
  }, {
    path: "login",
    component: app.Login
  }, {
    path: "thanks",
    component: app.Thanks
  }, {
    path: "terms",
    component: app.Terms
  }];

  app.MainRoutingProvider = ng.router.RouterModule.forRoot(mainRoutes);

  app.AppComponent = function () {};
  app.AppComponent.annotations = [new ng.core.Component({
    selector: 'app-component',
    directives: [ng.router.ROUTER_DIRECTIVES, app.Header, app.FooterComponent, app.FooterList],
    providers: [],
    template: '<playground-header></playground-header><router-outlet></router-outlet><playground-footer></playground-footer>'
  })];
  hljs.initHighlightingOnLoad();

  app.AppModule = ng.core.NgModule({
    imports: [ng.platformBrowser.BrowserModule, app.MainRoutingProvider],
    declarations: [app.AppComponent, app.Header, app.FooterComponent, app.FooterList, app.Home, app.Noobs, app.Learn, app.Terms, app.APIContent, app.MyPlayground, app.MyPlaygroundMyData, app.MyDataList, app.GenericDataDetail, app.GenericDataDetailDelete, app.GenericDataDetailGettingStarted, app.GenericDataDetailTemplates, app.GenericDataDetailFieldExplorer, app.GenericDataDetail, app.Showcase, app.ListObject, app.Login],
    providers: [ng.http.HTTP_PROVIDERS, app.ResourceCenterService, app.UserService, app.DataConnectionService, app.QSocksService, app.PubSub],
    bootstrap: [app.AppComponent]
  }).Class({
    constructor: function constructor() {}
  });

  document.addEventListener('DOMContentLoaded', function () {
    ng.platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(app.AppModule);
  });
})(window.app || (window.app = {}));

window.ga('create', 'UA-87754759-2', 'auto');
var currentPage = "fakeStartingPage";
setInterval(function () {
  if (currentPage !== window.location.href) {
    currentPage = window.location.href;
    window.ga('send', 'pageview', window.location.href);
  }
}, 1000);
