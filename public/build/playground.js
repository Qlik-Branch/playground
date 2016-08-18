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
    getConnectionDictionary: function getConnectionDictionary(index, callbackFn) {
      var _this2 = this;

      if (this.dataConnections) {
        var dictionaryUrl = this.dataConnections[index].dictionary;
        this.http.get(dictionaryUrl).subscribe(function (response) {
          callbackFn(JSON.parse(response._body));
        });
      } else {
        this.getDataConnections(function (response) {
          var dictionaryUrl = _this2.dataConnections[index].dictionary;
          _this2.http.get(dictionaryUrl).subscribe(function (response) {
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

  app.UserService = ng.core.Injectable({}).Class({
    constructor: [ng.http.Http, function (http) {
      this.http = http;
      this.user;
    }],
    getUser: function getUser(force, callbackFn) {
      var _this3 = this;

      if (!this.user || force === true) {
        console.log('fetching user info from server');
        this.http.get('/server/currentuser').subscribe(function (response) {
          if (response._body !== "") {
            response = JSON.parse(response._body);
            _this3.user = response;
            if (response.user) {
              _this3.parseConnections();
            }
            callbackFn(_this3.user);
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
      var _this4 = this;

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
              _this4.global = result[0];
              _this4.app = result[1];
              callbackFn(null, _this4.global, _this4.app);
            });
          }
        });
      } else {
        config.ticket = this.ticket;
        qsocks.ConnectOpenApp(config).then(function (result) {
          _this4.global = result[0];
          _this4.app = result[1];
          callbackFn(null, _this4.global, _this4.app);
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
      var _this5 = this;

      this.dialog;
      this.user;
      this.loginUrl;
      this.returnUrl;
      if (!userService.user) {
        userService.getUser(false, function (user) {
          _this5.user = user.user;
          _this5.loginUrl = user.loginUrl;
          _this5.returnUrl = user.returnUrl;
        });
      }
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

  app.Noobs = ng.core.Component({
    selector: 'playground-noobs',
    templateUrl: '/views/noobs.html'
  }).Class({
    constructor: function constructor() {
      console.log('constructor');
    }
  });

  app.Showcase = ng.core.Component({
    selector: 'playground-showcase',
    templateUrl: '/views/showcase.html'
  }).Class({
    constructor: function constructor() {
      console.log('constructor');
    }
  });

  app.Apis = ng.core.Component({
    selector: 'playground-apis',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/apis/apis.html'
  }).Class({
    constructor: function constructor() {}
  });

  app.Engine = ng.core.Component({
    selector: 'playground-engine',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/apis/engine.html'
  }).Class({
    constructor: function constructor() {}
  });

  app.Capability = ng.core.Component({
    selector: 'playground-capability',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/apis/capability.html'
  }).Class({
    constructor: function constructor() {}
  });

  app.APIContent = ng.core.Component({
    selector: 'playground-api-content',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/apis/api-content.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, app.ResourceCenterService, function (route, resourceCenterService) {
      var _this6 = this;

      this.route = route;
      this.resourceCenterService = resourceCenterService;
      this.api = this.route.parent.url.value[0].path;
      route.params.subscribe(function (route) {
        var resourceSubject = route.subject;
        _this6.getResourceContent(resourceSubject);
      });
    }],
    getResourceContent: function getResourceContent(subject) {
      var _this7 = this;

      var resourceId = null;
      this.resourceTitle = "";
      this.content = "";
      switch (this.api) {
        case "engine":
          switch (subject) {
            case "overview":

              break;
            case "connecting":

              break;
            case "hypercube":

              break;
            case "listobject":

              break;
            case "filtering":

              break;
            default:

          }
          break;
        case "capability":
          switch (subject) {
            case "overview":
              resourceId = "57b195052fe227f95f07cba4";
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
        default:

      }
      if (resourceId) {
        this.resourceCenterService.getResource(resourceId, function (resource) {
          resource = JSON.parse(resource);
          if (resource && resource.data && resource.data.length > 0) {
            resource = resource.data[0];
            _this7.resourceTitle = resource.title;
            console.log(resource);
            _this7.content = marked(_this7.arrayBufferToBase64(resource.content.data));
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
    constructor: [app.UserService, function (userService) {
      var _this8 = this;

      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      this.myConns;
      this.myConnKeys;
      userService.getUser(false, function (user) {
        _this8.myConns = user.myParsedConnections;
        _this8.myConnKeys = Object.keys(_this8.myConns);
        _this8.myRunningAppCount = user.runningAppCount;
      });
    }]
  });

  app.SampleDataList = ng.core.Component({
    selector: 'sample-data-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [],
    templateUrl: '/views/my-playground/sample-data-list.html'
  }).Class({
    constructor: [app.UserService, function (userService) {
      var _this9 = this;

      this.apps = {};
      this.appKeys = [];
      userService.getUser(false, function (user) {
        _this9.apps = user.sampleData;
        _this9.appKeys = Object.keys(_this9.apps);
      });
    }]
  });

  app.GenericDataDetailStatus = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail-status',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/generic-data-detail-status.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function (route, userService, dataConnectionService) {
      var _this10 = this;

      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      this.dataConnectionService = dataConnectionService;
      this.connectionId = route.parent.url.value[0].path;
      this.connectionStatus = 'Checking Status...';
      this.connectionStatusDetail = "";
      userService.getUser(false, function (user) {
        _this10.myRunningAppCount = user.runningAppCount;
        _this10.getConnectionInfo(_this10.connectionId);
      });
    }],
    getConnectionInfo: function getConnectionInfo(connectionId) {
      var _this11 = this;

      this.dataConnectionService.getConnectionInfo(connectionId, function (connInfo) {
        _this11.onConnectionInfo(connInfo);
      });
    },
    onConnectionInfo: function onConnectionInfo(info) {
      if (info.appname) {
        this.connectionStatus = "Running";
      } else {
        this.connectionStatus = "Stopped";
        this.connectionStatusDetail = "Please start the application to see more options.";
      }
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
      var _this12 = this;

      this.dataConnectionService.getConnectionInfo(connectionId, function (connInfo) {
        _this12.onConnectionInfo(connInfo);
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
      var _this13 = this;

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
        _this13.dataConnectionService.getConnectionInfo(_this13.connectionId, function (connInfo) {
          _this13.qsocksService.connect(connInfo, function (err, global, app) {
            if (err) {
              _this13.connectionStatus = "Error!";
              _this13.connectionDetail = err;
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
                  _this13.loading = false;
                  layout.qFieldList.qItems.forEach(function (item, index) {
                    _this13.fields[item.qName] = { selected: false };
                  });
                  console.log(_this13.fields);
                  _this13.fieldKeys = Object.keys(_this13.fields).sort();
                  _this13.cdr.detectChanges();
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
    constructor: [ng.router.ActivatedRoute, app.UserService, function (route, userService) {
      var _this14 = this;

      var connectionId = route.parent.url.value[0].path;
      this.connection = {};
      this.sampleProjects = {};
      this.isMyData = false;
      userService.getUser(false, function (user) {
        if (user.myParsedConnections[connectionId]) {
          _this14.isMyData = true;
          _this14.connection = user.myParsedConnections[connectionId];
        } else {
          _this14.connection = user.sampleData[connectionId];
        }
        _this14.sampleProjects = user.sampleProjects;
      });
    }],
    copyToClipboard: function copyToClipboard(index) {
      var itemInput = document.getElementById(index + "_clone_url");
      itemInput.select();
      document.execCommand('copy');
    }
  });

  app.GenericDataDetail = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail',
    directives: [ng.router.ROUTER_DIRECTIVES, ng.common.NgClass],
    templateUrl: '/views/my-playground/generic-data-detail.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function (route, userService, dataConnectionService) {
      var _this15 = this;

      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      this.dataConnectionService = dataConnectionService;
      var connectionId = route.url.value[0].path;
      this.parentPath = route.parent.url.value[0].path;
      this.connection = {};
      this.isMyData = false;
      userService.getUser(false, function (user) {
        _this15.myRunningAppCount = user.runningAppCount;
        if (user.myParsedConnections[connectionId]) {
          _this15.isMyData = true;
          _this15.connection = user.myParsedConnections[connectionId];
        } else {
          _this15.connectionStatus = "Running";
          _this15.connection = user.sampleData[connectionId];
        }
        _this15.getConnectionInfo(connectionId);
      });
    }],
    getConnectionInfo: function getConnectionInfo(connectionId) {
      var _this16 = this;

      this.dataConnectionService.getConnectionInfo(connectionId, function (connInfo) {
        _this16.onConnectionInfo(connInfo);
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
      var _this17 = this;

      this.connectionStatus = "Starting";
      this.connectionStatusDetail = "Starting application.";
      this.dataConnectionService.startApp(connectionId, function (connInfo) {
        _this17.getConnectionInfo(connectionId);
      });
    },
    stopApp: function stopApp(connectionId) {
      var _this18 = this;

      this.connectionStatus = "Stopping";
      this.connectionStatusDetail = "Stopping application.";
      this.dataConnectionService.stopApp(connectionId, function (connInfo) {
        _this18.getConnectionInfo(connectionId);
      });
    },
    reloadApp: function reloadApp(connectionId) {
      var _this19 = this;

      this.connectionStatus = "Reloading";
      this.connectionStatusDetail = "Reloading application.";
      this.dataConnectionService.reloadApp(connectionId, function (connInfo) {
        _this19.getConnectionInfo(connectionId);
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

  app.MyPlaygroundSampleData = ng.core.Component({
    selector: 'playground-my-playground-sample-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-sample-data.html'
  }).Class({
    constructor: function constructor() {}
  });

  app.MyPlaygroundConnect = ng.core.Component({
    selector: 'playground-my-playground-connect',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-connect.html'
  }).Class({
    constructor: [app.UserService, function (userService) {
      var _this20 = this;

      this.conns;
      this.connKeys;
      userService.getUser(false, function (user) {
        _this20.conns = user.dataConnections;
        _this20.connKeys = Object.keys(_this20.conns);
      });
    }]
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
      var _this21 = this;

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
        _this21.pubsub.subscribe('update', genericObject.handle, _this21.getLayout.bind(_this21));
        _this21.genericObject = genericObject;
        _this21.getLayout();
      });
    },
    clearAll: function clearAll() {},
    search: function search() {},
    getLayout: function getLayout() {
      var _this22 = this;

      this.listValues = [];
      this.genericObject.getLayout().then(function (layout) {
        var matrix = layout.qListObject.qDataPages[0].qMatrix;
        matrix.forEach(function (row, index) {
          _this22.listValues.push(row[0]);
        });
        _this22.cdr.detectChanges();
      });
    },
    toggleValue: function toggleValue(elemNum) {
      var _this23 = this;

      this.genericObject.selectListObjectValues("/qListObjectDef", [parseInt(elemNum)], true).then(function (response) {
        _this23.pubsub.publish('update');
      });
    }
  });

  // app.ListObject = (function(){
  //   function ListObject(){
  //
  //   }
  //   ListObject.prototype = Object.create(Object.prototype({
  //     field: {
  //       writable: true,
  //       value: null
  //     },
  //
  //   }));
  // });
  //
  // app.ListObject.annotations = [
  //   new ng.core.Component({
  //     selector: 'playground-vis-listobject',
  //     inputs: ['field:field'],
  //     templateUrl: '/views/vis/list-object.html'
  //   })
  // ];


  // //my playground main component
  app.MyPlayground = ng.core.Component({
    selector: 'playground-my-playground',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground.html'
  }).Class({
    constructor: function constructor() {}
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
  }];

  var mainRoutes = [{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }, {
    path: "home",
    component: app.Home
  }, {
    path: "noobs",
    component: app.Noobs
  }, {
    path: 'apis',
    component: app.Apis,
    children: [{
      path: '',
      pathMatch: 'full',
      redirectTo: 'engine'
    }, {
      path: 'engine',
      component: app.Engine,
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
      component: app.Capability,
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
      path: 'mydata',
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
    declarations: [app.AppComponent, app.Header, app.FooterComponent, app.FooterList, app.Home, app.Noobs, app.Apis, app.Engine, app.Capability, app.APIContent, app.MyPlayground, app.MyPlaygroundMyData, app.MyPlaygroundSampleData, app.MyPlaygroundConnect, app.MyDataList, app.SampleDataList, app.GenericDataDetail, app.GenericDataDetailStatus, app.GenericDataDetailGettingStarted, app.GenericDataDetailTemplates, app.GenericDataDetailFieldExplorer, app.GenericDataDetail, app.Showcase, app.ListObject],
    providers: [ng.http.HTTP_PROVIDERS, app.ResourceCenterService, app.UserService, app.DataConnectionService, app.QSocksService, app.PubSub],
    bootstrap: [app.AppComponent]
  }).Class({
    constructor: function constructor() {}
  });

  document.addEventListener('DOMContentLoaded', function () {
    ng.platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(app.AppModule);
  });
})(window.app || (window.app = {}));
