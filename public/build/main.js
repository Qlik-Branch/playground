(function(playground){

  //service declarations
  var ConfigService =
      ng.core.Injectable({

          })
          .Class({
              constructor: [ng.http.Http, function(http){
                  this.http = http;
              }],
              getConfigs: function(callbackFn){
                  this.http.get('/api/configs').subscribe(response => {
                      if(response._body!==""){
                      callbackFn(JSON.parse(response._body));
                  }
                  else{
                      callbackFn();
                  }
              });
              }
          });

  let UserService =
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
    },
    getUserConnections: function(callbackFn){
      this.http.get('/api/currentuserconnections').subscribe(response => {
        if(response._body!==""){
          callbackFn(JSON.parse(response._body));
        }
        else{
          callbackFn();
        }
      });
    }
  });

  let SampleDataService =
  ng.core.Injectable({

  })
  .Class({
    constructor: [ng.http.Http, function(http){
      this.http = http;
      this.sampleData;
      this.sampleProjects;
    }],
    getSampleData: function(callbackFn){
      if(this.sampleData){
        callbackFn(this.sampleData);
      }
      else{
        this.http.get('/api/sampledata').subscribe(response => {
          if(response._body!==""){
            this.sampleData = JSON.parse(response._body);
            callbackFn(JSON.parse(response._body));
          }
          else{
            callbackFn();
          }
        });
      }
    },
    getSampleProjects: function(callbackFn){
      if(this.sampleProjects){
        callbackFn(this.sampleProjects);
      }
      else{
        this.http.get('/api/sampleprojects').subscribe(response => {
          if(response._body!==""){
            this.sampleProjects = JSON.parse(response._body);
            callbackFn(JSON.parse(response._body));
          }
          else{
            callbackFn();
          }
        });
      }
    }
  });

  let DataConnectionService =
  ng.core.Injectable({

  })
  .Class({
    constructor: [ng.http.Http, function(http){
      this.http = http;
      this.dataConnections;
    }],
    getDataConnections: function(callbackFn){
      if(this.dataConnections){
        callbackFn(this.dataConnections);
      }
      else{
        this.http.get('/api/dataconnections').subscribe(response => {
          if(response._body!==""){
            this.dataConnections = JSON.parse(response._body);
            callbackFn(JSON.parse(response._body));
          }
          else{
            callbackFn();
          }
        });
      }
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
      this.http.post("/api/authorise/"+connectionId).subscribe(response => {
        callbackFn(JSON.parse(response._body));
      });
    }
  });


  //component declarations
  let Header = ng.core.Component({
    selector: 'playground-header',
    directives: [ng.router.ROUTER_DIRECTIVES],
    providers: [ConfigService,UserService],
    templateUrl: '/views/header.html'
  })
  .Class({
    constructor: [ConfigService,UserService, function(configService,userService){
      configService.getConfigs((configs) => {
        this.loginUrl = configs.loginUrl;
        this.returnUrl = configs.returnUrl;
      });
      userService.getUser((user) => {
        this.user = user;
      });
    }]
  });

  let FooterList = ng.core.Component({
    selector: 'playground-footer-list',
    inputs: ['data: data'],
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/footer-list.html'
  })
  .Class({
    constructor: function(){

    }
  });

  let FooterComponent = ng.core.Component({
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

  let ComingSoon = ng.core.Component({
    selector: 'coming-soon',
    template: '<div class=\'coming-soon\'>Coming Soon</div>'
  })
  .Class({
    constructor: function(){
      
    }
  });

  let Home = ng.core.Component({
    selector: 'playground-home',
    templateUrl: '/views/home.html'
  })
  .Class({
    constructor: function(){
      console.log('constructor');
    }
  });

  let Noobs = ng.core.Component({
    selector: 'playground-noobs',
    templateUrl: '/views/noobs.html'
  })
  .Class({
    constructor: function(){
      console.log('constructor');
    }
  });

  let SampleDataDetails = ng.core.Component({
    selector: 'sample-data-details',
    directives: [],
    viewProviders: [ng.router.ROUTER_PROVIDERS, SampleDataService],
    templateUrl: '/views/my-playground/sample-data-details.html'
  })
  .Class({
    constructor: [ng.router.RouteSegment, SampleDataService, function(routeSegment, sampleDataService){
      this.routeSegment = routeSegment;
      this.appId = routeSegment.parameters.id;
      this.selectedApp = {};
      this.sampleProjects = [];
      this.selectedProject = {};
      sampleDataService.getExampleApps((apps)=>{
        this.selectedApp = apps[this.appId];
        this.config = JSON.stringify(this.selectedApp.config, null, ' ');
        this.sampleProjects = this.selectedApp['sample-projects'];
        if(this.sampleProjects.length > 0){
          this.selectedProject = this.sampleProjects[0];
        }
      })
    }],
    copyToClipboard: function(index){
      var itemInput = document.getElementById(index+"_clone_url");
      itemInput.select();
      document.execCommand('copy');
    }
  })

  let SampleDataList = ng.core.Component({
    selector: 'sample-data-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [],
    templateUrl: '/views/my-playground/sample-data-list.html'
  })
  .Class({
    constructor: [SampleDataService, function(sampleDataService){
      this.apps = {};
      this.appKeys = [];
      this.selectedApp = {};  
      sampleDataService.getSampleData((apps)=>{
        this.apps = apps;
        this.appKeys = Object.keys(apps);
        this.selectedApp = this.apps[this.appKeys[0]];
      });
    }]
  })

  let YourDataDetails = ng.core.Component({
    selector: 'your-data-details',
    directives: [],
    viewProviders: [ng.router.ROUTER_PROVIDERS],
    templateUrl: '/views/getting-started/your-data-details.html'
  })
  .Class({
    constructor: [ng.router.RouteSegment, function(routeSegment){
      this.routeSegment = routeSegment;
      this.appId = routeSegment.parameters.id;
    }]
  })

  let YourDataList = ng.core.Component({
    selector: 'your-data-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [],
    templateUrl: '/views/getting-started/your-data-list.html'
  })
  .Class({
    constructor: [function(){

    }]
  })

  let DataConnectionDetails = ng.core.Component({
    selector: 'data-connection-details',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [ng.router.ROUTER_PROVIDERS],
    templateUrl: '/views/my-playground/data-connection-details.html'
  })
  .Class({
    constructor: [ng.router.RouteSegment, DataConnectionService, function(routeSegment, dataConnectionService){
      this.routeSegment = routeSegment;
      this.connectionId = routeSegment.parameters.id;
      this.connectionDictionary = {};
      dataConnectionService.getConnectionDictionary(this.connectionId, (info)=> {
        this.connectionDictionary = info;
        console.log(info);
      });
    }],
    authorizeConnection: function(connId){
      dataConnectionService.authorizeConnection(connId, (result)=>{

      });
    }
  })

  let DataConnectionList = ng.core.Component({
    selector: 'data-connection-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [],
    templateUrl: '/views/my-playground/data-connection-list.html'
  })
  .Class({
    constructor: [UserService, DataConnectionService, function(userService, dataConnectionService){
      this.dataConnectionService = dataConnectionService;
      this.userService = userService;
      this.dataConnectionService.getDataConnections((conns)=>{
        this.conns = conns;
        this.connKeys = Object.keys(conns);
        this.userService.getUserConnections((userConns)=>{
          console.log(userConns);
          if(userConns.err){

          }
          else {
            for(let c=0;c<userConns.connections.length;c++){
              if(this.conns[userConns.connections[c].connection]){
                this.conns[userConns.connections[c].connection].authorised = true;
              }
              else{
                this.conns[userConns.connections[c].connection].authorised = false;
              }
            }
          }
        });
      });
    }],
    authoriseConnection: function(key){
      this.dataConnectionService.authoriseConnection(key, (response) => {
        console.log(response);
      })
    }
  })

  let MyPlaygroundMain = ng.core.Component({
    selector: 'playground-my-playground-main',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-main.html'
  })
  .Class({
    constructor: [UserService, DataConnectionService, SampleDataService, function(userService, dataConnectionService, sampleDataService){
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
      userService.getUser((user) => {
        console.log(user);
        this.user = user;
      });
      this.getSampleProjects();
    }],
    getConnections: function(){
      if(!this.conns){
        this.dataConnectionService.getDataConnections((conns)=>{
          this.conns = conns;
          this.connKeys = Object.keys(conns);
          this.getMyConnections((userConns)=>{
            if(userConns.err){

            }
            else {
              for(let c=0;c<userConns.connections.length;c++){
                if(this.conns[userConns.connections[c].connection]){
                  this.conns[userConns.connections[c].connection].authorised = true;
                  this.myParsedConns[userConns.connections[c].connection] = this.conns[userConns.connections[c].connection];
                }
                else{
                  this.conns[userConns.connections[c].connection].authorised = false;
                }
              }
              this.myConnKeys = Object.keys(this.myParsedConns);
            }
          });
        });
      }
    },
    getMyConnections: function(callbackFn){
      if(this.myConns){
        if(callbackFn){
          callbackFn(this.myConns);
        }
      }
      else{
        this.userService.getUserConnections((userConns)=>{
          this.myConns = userConns;
          if(callbackFn){
            callbackFn(this.myConns);
          }
        });
      }
    },
    getSampleData: function(){
      if(!this.apps){
        this.sampleDataService.getSampleData((apps)=>{
          this.apps = apps;
          this.appKeys = Object.keys(apps);
        });
      }
    },
    getSampleProjects: function(){
      if(!this.sampleProjects){
        this.sampleDataService.getSampleProjects((projects)=>{
          console.log(projects);
          this.sampleProjects = projects;
        });
      }
    },
    setActiveTab: function(index){
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
    showDetail: function(key, itemType){
      switch (itemType) {
        case "connection":
          this.selectedItem = this.conns[key];
          this.isTabDetail = true;
          break;
        default:

      }
    },
    hideDetail: function(){
      this.selectedItem = {};
      this.isTabDetail = false;
    },
    copyToClipboard: function(index){
      var itemInput = document.getElementById(index+"_clone_url");
      itemInput.select();
      document.execCommand('copy');
    }
  })

  let MyPlaygroundSampleData = ng.core.Component({
    selector: 'playground-my-playground-sample-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-sample-data.html'
  })
  .Class({
    constructor: function(){

    }
  })

  MyPlaygroundSampleData = ng.router.Routes([
    {
      path: "/",
      component: SampleDataList
    },
    {
      path: "/:id",
      component: SampleDataDetails
    },
    {
      path: '/**',
      redirectTo: ['/']
    }
  ])(MyPlaygroundSampleData);

  let MyPlaygroundYourData = ng.core.Component({
    selector: 'playground-my-playground-your-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-your-data.html'
  })
  .Class({
    constructor: function(){

    }
  })

  MyPlaygroundYourData = ng.router.Routes([
    {
      path: "/",
      component: YourDataList
    },
    {
      path: "/:id",
      component: YourDataDetails
    },
    {
      path: '/**',
      redirectTo: ['/']
    }
  ])(MyPlaygroundYourData);

  let MyPlaygroundConnect = ng.core.Component({
    selector: 'playground-my-playground-connect',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/my-playground-connect.html'
  })
  .Class({
    constructor: function(){

    }
  })

  MyPlaygroundConnect = ng.router.Routes([
    {
      path: "/",
      component: DataConnectionList
    },
    {
      path: "/:id",
      component: DataConnectionDetails
    },
    {
      path: '/**',
      redirectTo: ['/']
    }
  ])(MyPlaygroundConnect);

  var MyPlayground = ng.core.Class({
    constructor: function(){
      console.log('here');
    }
  })

  MyPlayground = ng.core.Component({
    selector: 'playground-my-playground',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [UserService, DataConnectionService, SampleDataService],
    templateUrl: '/views/my-playground/my-playground.html'
  })(MyPlayground);

  MyPlayground = ng.router.Routes([
    {
      path: "/",
      component: MyPlaygroundMain
    },
    {
      path: "/sampledata",
      component: MyPlaygroundSampleData
    },
    {
      path: "/yourdata",
      component: MyPlaygroundYourData
    },
    {
      path: "/connect",
      component: MyPlaygroundConnect
    },
    {
      path: '/**',
      redirectTo: ['/']
    }
  ])(MyPlayground);

  let Showcase = ng.core.Component({
    selector: 'playground-showcase',
    templateUrl: '/views/showcase.html'
  })
  .Class({
    constructor: function(){
      console.log('constructor');
    }
  });


  let AppComponent = function(){};
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
        path: "/myplayground",
        component: MyPlayground
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
