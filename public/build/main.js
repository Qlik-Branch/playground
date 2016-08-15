(function(app){

  // //service declarations
  app.ResourceCenterService = ng.core.Injectable({

  })
  .Class({
      constructor: [ng.http.Http, function(http){
          this.http = http;
      }],
      getResource: function(id, callbackFn){
          this.http.get('/server/resource/'+id).subscribe(response => {
            if(response._body!==""){
              callbackFn(JSON.parse(response._body));
            }
            else{
              callbackFn();
            }
          });
      }
  });

  app.DataConnectionService =
  ng.core.Injectable({

  })
  .Class({
    constructor: [ng.http.Http, function(http){
      this.http = http;
      this.data;
    }],
    getDataConnections: function(force, callbackFn){
      if(!this.data || force===true){
        this.http.get('/server/dataconnections').subscribe(response => {
          if(response._body!==""){
            response = JSON.parse(response._body);
            this.data = response;
            callbackFn(this.data);
          }
          else{
            callbackFn();
          }
        });
      }
      else{
        callbackFn(this.data);
      }
    },
    getConnectionInfo: function(connectionId, callbackFn){
      this.http.get('/server/connectioninfo/'+connectionId).subscribe(response => {
        if(response._body!==""){
          callbackFn(JSON.parse(response._body));
        }
        else{
          callbackFn();
        }
      });
    },
    getConnectionDictionary: function(index, callbackFn){
      if(this.dataConnections){
        var dictionaryUrl = this.dataConnections[index].dictionary;
        this.http.get(dictionaryUrl).subscribe(response => {
          callbackFn(JSON.parse(response._body));
        });
      }
      else{
        this.getDataConnections((response)=>{
          var dictionaryUrl = this.dataConnections[index].dictionary;
          this.http.get(dictionaryUrl).subscribe(response => {
            callbackFn(JSON.parse(response._body));
          });
        });
      }
    },
    authoriseConnection: function(connectionId, callbackFn){
      this.http.post("/server/authorise/"+connectionId).subscribe(response => {
        callbackFn(JSON.parse(response._body));
      });
    },
    startApp: function(connectionId, callbackFn){
      this.http.get("/server/startapp/"+connectionId).subscribe(response => {
        callbackFn(JSON.parse(response._body));
      });
    },
    stopApp: function(connectionId, callbackFn){
      this.http.get("/server/stopapp/"+connectionId).subscribe(response => {
        callbackFn(JSON.parse(response._body));
      });
    },
    reloadApp: function(connectionId, callbackFn){
      this.http.get("/server/reloadapp/"+connectionId).subscribe(response => {
        callbackFn(JSON.parse(response._body));
      });
    }

  });

  app.UserService =
  ng.core.Injectable({

  })
  .Class({
    constructor: [ng.http.Http, function(http){
      this.http = http;
      this.user;
    }],
    getUser: function(force, callbackFn){
      if(!this.user || force===true){
        console.log('fetching user info from server');
        this.http.get('/server/currentuser').subscribe(response => {
          if(response._body!==""){
            response = JSON.parse(response._body)
            this.user = response;
            if(response.user){
              this.parseConnections();  
            }
            callbackFn(this.user);
          }
          else{
            callbackFn();
          }
        });
      }
      else{
        callbackFn(this.user);
      }
    },
    getUserConnections: function(callbackFn){
      this.http.get('/server/currentuserconnections').subscribe(response => {
        if(response._body!==""){
          callbackFn(JSON.parse(response._body));
        }
        else{
          callbackFn();
        }
      });
    },
    parseConnections: function(callbackFn){
      this.user.myParsedConnections = {};
      this.user.runningAppCount = 0;
      for(let c=0;c<this.user.myConnections.length;c++){
        if(this.user.dataConnections[this.user.myConnections[c].connection]){
          this.user.dataConnections[this.user.myConnections[c].connection].authorised = true;
          this.user.myParsedConnections[this.user.myConnections[c].connection] = this.user.dataConnections[this.user.myConnections[c].connection];
          if(this.user.myConnections[c].appid){
            this.user.myParsedConnections[this.user.myConnections[c].connection].appid = this.user.myConnections[c].appid;
            this.user.runningAppCount++;
          }
        }
        else{
          this.user.dataConnections[this.user.myConnections[c].connection].authorised = false;
        }
      }
    }
  });

  //
  // //main component declarations
  app.Header = ng.core.Component({
    selector: 'playground-header',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/header.html'
  })
  .Class({
    constructor: [app.UserService, function(userService){
      this.dialog;
      this.user;
      this.loginUrl;
      this.returnUrl;
      if(!userService.user){
        userService.getUser(false, (user) => {
          this.user = user.user;
          this.loginUrl = user.loginUrl;
          this.returnUrl = user.returnUrl;
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

  app.FooterList = (function(){
    function FooterList(){

    }
    FooterList.data = [];
  });

  app.FooterList.annotations = [
    new ng.core.Component({
      selector: 'playground-footer-list',
      inputs: ['data:data'],
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: '/views/footer-list.html'
    })
  ];

  app.FooterComponent = ng.core.Component({
    selector: 'playground-footer',
    directives: [ng.router.ROUTER_DIRECTIVES, app.FooterList],
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

  app.ComingSoon = ng.core.Component({
    selector: 'coming-soon',
    template: '<div class=\'coming-soon\'>Coming Soon</div>'
  })
  .Class({
    constructor: function(){

    }
  });

  app.Home = ng.core.Component({
    selector: 'playground-home',
    templateUrl: '/views/home.html'
  })
  .Class({
    constructor: function(){
      console.log('constructor');
    }
  });

  app.Noobs = ng.core.Component({
    selector: 'playground-noobs',
    templateUrl: '/views/noobs.html'
  })
  .Class({
    constructor: function(){
      console.log('constructor');
    }
  });

  app.Showcase = ng.core.Component({
    selector: 'playground-showcase',
    templateUrl: '/views/showcase.html'
  })
  .Class({
    constructor: function(){
      console.log('constructor');
    }
  });

  // // include "./components/my-playground/sample-data-details.js"
  app.SampleDataList = ng.core.Component({
    selector: 'sample-data-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [],
    templateUrl: '/views/my-playground/sample-data-list.html'
  })
  .Class({
    constructor: [app.UserService, function(userService){
      this.apps = {};
      this.appKeys = [];    
      userService.getUser(false, (user)=>{
        this.apps = user.sampleData;
        this.appKeys = Object.keys(this.apps);
      });
    }]
  })

  // // include "./components/my-playground/your-data-details.js"

  app.Apis = ng.core.Component({
    selector: 'playground-apis',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/apis/apis.html'
  }).Class({
    constructor: function(){

    }
  });

  app.Engine = ng.core.Component({
    selector: 'playground-engine',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/apis/engine.html'
  }).Class({
    constructor: function(){

    }
  });

  app.Capability = ng.core.Component({
    selector: 'playground-capability',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/apis/capability.html'
  }).Class({
    constructor: function(){

    }
  });

  app.APIContent = ng.core.Component({
    selector: 'playground-api-content',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/apis/api-content.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, app.ResourceCenterService, function(route, resourceCenterService){
      this.route = route;
      this.resourceCenterService = resourceCenterService;
      this.api = this.route.parent.url.value[0].path;
      route.params.subscribe((route)=>{
        let resourceSubject = route.subject;
        this.getResourceContent(resourceSubject);
      });
    }],
    getResourceContent: function(subject){
      let resourceId = null;
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
      if(resourceId){
        this.resourceCenterService.getResource(resourceId, (resource)=>{
          resource = JSON.parse(resource);
          if(resource && resource.data && resource.data.length > 0){
            resource = resource.data[0];
            this.resourceTitle = resource.title;
            console.log(resource);
            this.content = marked(this.arrayBufferToBase64(resource.content.data));
          }
        });
      }
    },
    arrayBufferToBase64: function( buffer ) {
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return binary ;
    }
  });


  app.MyDataList = ng.core.Component({
    selector: 'my-data-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-data-list.html'
  })
  .Class({
    constructor: [app.UserService, function(userService){
      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      this.myConns;
      this.myConnKeys;
      userService.getUser(false, (user)=>{
        this.myConns = user.myParsedConnections;
        this.myConnKeys = Object.keys(this.myConns);
        this.myRunningAppCount = user.runningAppCount;
      })
    }
    ]
  })

  // // include "./components/my-playground/data-connection-details.js"
  // // include "./components/my-playground/data-connection-list.js"
  app.GenericDataDetailStatus = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail-status',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/generic-data-detail-status.html'
  })
  .Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function(route, userService, dataConnectionService){
      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      this.dataConnectionService = dataConnectionService;
      this.connectionId = route.parent.url.value[0].path;
      this.connectionStatus = 'Checking Status...';
      this.connectionStatusDetail = "";
      userService.getUser(false, (user)=>{
        this.myRunningAppCount = user.runningAppCount;
        this.getConnectionInfo(this.connectionId);
      });
    }],
    getConnectionInfo: function(connectionId){
      this.dataConnectionService.getConnectionInfo(connectionId, (connInfo)=>{
        this.onConnectionInfo(connInfo);
      });
    },
    onConnectionInfo: function(info){
      if(info.appname){
        this.connectionStatus = "Started";
      }
      else {
        this.connectionStatus = "Stopped";
        this.connectionStatusDetail = "Please start the application to see more options.";
      }
    }
  })

  app.GenericDataDetailGettingStarted = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail-gettingstarted',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/generic-data-detail-gettingstarted.html'
  })
  .Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function(route, userService, dataConnectionService){
      this.dataConnectionService = dataConnectionService;
      let connectionId = route.parent.url.value[0].path;
      this.connectionConfig;
      this.getConnectionInfo(connectionId);
    }],
    getConnectionInfo: function(connectionId){
      this.dataConnectionService.getConnectionInfo(connectionId, (connInfo)=>{
        this.onConnectionInfo(connInfo);
      });
    },
    onConnectionInfo: function(info){
      if(info.appname){
        this.connectionStatus = "Started";
      }
      else {
        this.connectionStatus = "Stopped";
      }
      var connInfoStr = JSON.stringify(info);
      //dirty method for styling text and removing quotes (required so that the capability api reads the properties correctly)
      connInfoStr = connInfoStr.replace(/\{/gim, '{\n\t')
                               .replace(/,/gim, ',\n\t')
                               .replace(/\}/gim, '\n}');
      var connStrComponents = connInfoStr.split(",");
      var parsedComponents=[];
      for(var i=0;i<connStrComponents.length;i++){
        var keyVal = connStrComponents[i].split(":");
        parsedComponents.push(keyVal[0].replace(/\"/gim, '')+':'+keyVal[1]);
      }
      connInfoStr = parsedComponents.join(",");
      this.connectionConfig = connInfoStr.trim();
      setTimeout(function(){
        $('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        });
      }, 100);
    }
  })

  app.GenericDataDetailTemplates = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail-templates',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/generic-data-detail-templates.html'
  })
  .Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, function(route, userService){
      let connectionId = route.parent.url.value[0].path;
      this.connection = {};
      this.sampleProjects = {};
      this.isMyData = false;
      userService.getUser(false, (user)=>{
        if(user.myParsedConnections[connectionId]){
          this.isMyData = true;
          this.connection = user.myParsedConnections[connectionId];
        }
        else{
          this.connection = user.sampleData[connectionId];
        }
        this.sampleProjects = user.sampleProjects;
      });
    }],
    copyToClipboard: function(index){
      var itemInput = document.getElementById(index+"_clone_url");
      itemInput.select();
      document.execCommand('copy');
    }
  })

  app.GenericDataDetail = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail',
    directives: [ng.router.ROUTER_DIRECTIVES, ng.common.NgClass],
    templateUrl: '/views/my-playground/generic-data-detail.html'
  })
  .Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function(route, userService, dataConnectionService){
      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      this.dataConnectionService = dataConnectionService;
      let connectionId = route.url.value[0].path;
      this.parentPath = route.parent.url.value[0].path;
      this.connection = {};
      this.isMyData = false;
      userService.getUser(false, (user)=>{
        this.myRunningAppCount = user.runningAppCount;
        if(user.myParsedConnections[connectionId]){
          this.isMyData = true;
          this.connection = user.myParsedConnections[connectionId];
        }
        else{
          this.connectionStatus = "Started";
          this.connection = user.sampleData[connectionId];
        }
        this.getConnectionInfo(connectionId);
      });
    }],
    getConnectionInfo: function(connectionId){
      this.dataConnectionService.getConnectionInfo(connectionId, (connInfo)=>{
        this.onConnectionInfo(connInfo);
      });
    },
    onConnectionInfo: function(info){
      if(info.appname){
        this.connectionStatus = "Started";
      }
      else {
        this.connectionStatus = "Stopped";
        this.connectionStatusDetail = "";
      }
    },
    startApp: function(connectionId){
      this.connectionStatus = "Starting";
      this.connectionStatusDetail = "Starting application.";
      this.dataConnectionService.startApp(connectionId, (connInfo)=>{
        this.getConnectionInfo(connectionId);
      })
    },
    stopApp: function(connectionId){
      this.connectionStatus = "Stopping";
      this.connectionStatusDetail = "Stopping application.";
      this.dataConnectionService.stopApp(connectionId, (connInfo)=>{
        this.getConnectionInfo(connectionId);
      })
    },
    reloadApp: function(connectionId){
      this.connectionStatus = "Reloading";
      this.connectionStatusDetail = "Reloading application.";
      this.dataConnectionService.reloadApp(connectionId, (connInfo)=>{
        this.getConnectionInfo(connectionId);
      })
    }
  })

  app.MyPlaygroundMyData = ng.core.Component({
    selector: 'playground-my-playground-my-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-my-data.html'
  })
  .Class({
    constructor: function(){

    }
  });

  app.MyPlaygroundSampleData = ng.core.Component({
    selector: 'playground-my-playground-sample-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-sample-data.html'
  })
  .Class({
    constructor: function(){

    }
  })

  // // include "./components/my-playground/my-playground-your-data.js"
  app.MyPlaygroundConnect = ng.core.Component({
    selector: 'playground-my-playground-connect',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-connect.html'
  })
  .Class({
    constructor: [app.UserService, function(userService){
      this.conns;
      this.connKeys;
      userService.getUser(false, (user)=>{
        this.conns = user.dataConnections;
        this.connKeys = Object.keys(this.conns);
      })
    }]
  })


  // //my playgorund main component
  app.MyPlayground = ng.core.Component({
    selector: 'playground-my-playground',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground.html'
  }).Class({
    constructor: function(){

    }
  });

  //
  // //main routing
  let genericDataDetailRoutes = [
    {
      path: '',
      redirectTo: 'gettingstarted',
      pathMatch: 'full'
    },
    {
      path: 'gettingstarted',
      component: app.GenericDataDetailGettingStarted
    },
    {
      path: 'templates',
      component: app.GenericDataDetailTemplates
    }
  ];

  let mainRoutes = [
    {
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    },
    {
      path: "home",
      component: app.Home
    },
    {
      path: "noobs",
      component: app.Noobs
    },
    {
      path: 'apis',
      component: app.Apis,
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'engine'
        },
        {
          path: 'engine',
          component: app.Engine,
          children: [
            {
              path: '',
              pathMatch: 'full',
              redirectTo: 'overview'
            },
            {
              path: ':subject',
              component: app.APIContent
            }
          ]
        },
        {
          path: 'capability',
          component: app.Capability,
          children: [
            {
              path: '',
              pathMatch: 'full',
              redirectTo: 'overview'
            },
            {
              path: ':subject',
              component: app.APIContent
            }
          ]
        }
      ]
    },
    {
      path: 'myplayground',
      component: app.MyPlayground,
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'mydata'
        },
        {
          path: 'mydata',
          component: app.MyPlaygroundMyData,
          children: [
            {
              path: '',
              component: app.MyDataList
            },
            {
              path: ':id',
              component: app.GenericDataDetail,
              children: genericDataDetailRoutes
            }
          ]
        },
        {
          path: 'sampledata',
          component: app.MyPlaygroundSampleData,
          children: [
            {
              path: '',
              component: app.SampleDataList
            },
            {
              path: ':id',
              component: app.GenericDataDetail,
              children: genericDataDetailRoutes
            }
          ]
        },
        {
          path: 'connect',
          component: app.MyPlaygroundConnect
        }
      ]
    },
    {
      path: "showcase",
      component: app.Showcase
    }
  ];

  app.MainRoutingProvider = ng.router.RouterModule.forRoot(mainRoutes);


  app.AppComponent = function(){};
  app.AppComponent.annotations = [
    new ng.core.Component({
      selector: 'app-component',
      directives: [ng.router.ROUTER_DIRECTIVES, app.Header, app.FooterComponent, app.FooterList],
      providers: [],    
      template: '<playground-header></playground-header><router-outlet></router-outlet><playground-footer></playground-footer>'
    })
  ];
  hljs.initHighlightingOnLoad();

  app.AppModule = ng.core.NgModule({
    imports: [ ng.platformBrowser.BrowserModule, app.MainRoutingProvider],
    declarations: [
      app.AppComponent,
      app.Header,
      app.FooterComponent,
      app.FooterList,
      app.Home,
      app.Noobs,
      app.Apis,
      app.Engine,
      app.Capability,
      app.APIContent,
      app.MyPlayground,
      app.MyPlaygroundMyData,
      app.MyPlaygroundSampleData,
      app.MyPlaygroundConnect,
      app.MyDataList,
      app.SampleDataList,
      app.GenericDataDetail,
      app.GenericDataDetailStatus,
      app.GenericDataDetailGettingStarted,
      app.GenericDataDetailTemplates,
      app.GenericDataDetail,
      app.Showcase
    ],
    providers: [
      ng.http.HTTP_PROVIDERS,
      app.ResourceCenterService,
      app.UserService,
      app.DataConnectionService
    ],
    bootstrap: [ app.AppComponent ]
  })
  .Class({
    constructor: function() {}
  });


  document.addEventListener('DOMContentLoaded', function(){
    ng.platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(app.AppModule);
  });

})(window.app || (window.app = {}));
