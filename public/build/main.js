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

  var UserService =
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
    }
  });

  let SampleDataService =
  ng.core.Injectable({

  })
  .Class({
    constructor: [ng.http.Http, function(http){
      this.http = http;
      this.sampleData;
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
    templateUrl: '/views/projects-dashboard/sample-data-details.html'
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
    templateUrl: '/views/projects-dashboard/sample-data-list.html'
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
    templateUrl: '/views/projects-dashboard/data-connection-details.html'
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
    templateUrl: '/views/projects-dashboard/data-connection-list.html'
  })
  .Class({
    constructor: [DataConnectionService, function(dataConnectionService){
      this.dataConnectionService = dataConnectionService;
      this.dataConnectionService.getDataConnections((conns)=>{
        this.conns = conns;
        this.connKeys = Object.keys(conns);
      });
    }],
    authoriseConnection: function(key){
      this.dataConnectionService.authoriseConnection(key, (response) => {
        console.log(response);
      })
    }
  })

  let ProjectsDashboardMain = ng.core.Component({
    selector: 'playground-projects-dashboard-main',
    directives: [ng.router.ROUTER_DIRECTIVES, ComingSoon],
    templateUrl: '/views/projects-dashboard/projects-dashboard-main.html'
  })
  .Class({
    constructor: function(){

    }
  })

  let ProjectsDashboardSampleData = ng.core.Component({
    selector: 'playground-projects-dashboard-sample-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/projects-dashboard/projects-dashboard-sample-data.html'
  })
  .Class({
    constructor: function(){

    }
  })

  ProjectsDashboardSampleData = ng.router.Routes([
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
  ])(ProjectsDashboardSampleData);

  let ProjectsDashboardYourData = ng.core.Component({
    selector: 'playground-projects-dashboard-your-data',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/projects-dashboard/projects-dashboard-your-data.html'
  })
  .Class({
    constructor: function(){

    }
  })

  ProjectsDashboardYourData = ng.router.Routes([
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
  ])(ProjectsDashboardYourData);

  let ProjectsDashboardConnect = ng.core.Component({
    selector: 'playground-projects-dashboard-connect',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/projects-dashboard/projects-dashboard-connect.html'
  })
  .Class({
    constructor: function(){

    }
  })

  ProjectsDashboardConnect = ng.router.Routes([
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
  ])(ProjectsDashboardConnect);

  var ProjectsDashboard = ng.core.Class({
    constructor: function(){
      console.log('here');
    }
  })

  ProjectsDashboard = ng.core.Component({
    selector: 'playground-projects-dashboard',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [DataConnectionService, SampleDataService],
    templateUrl: '/views/projects-dashboard/projects-dashboard.html'
  })(ProjectsDashboard);

  ProjectsDashboard = ng.router.Routes([
    {
      path: "/",
      component: ProjectsDashboardMain
    },
    {
      path: "/sampledata",
      component: ProjectsDashboardSampleData
    },
    {
      path: "/yourdata",
      component: ProjectsDashboardYourData
    },
    {
      path: "/connect",
      component: ProjectsDashboardConnect
    },
    {
      path: '/**',
      redirectTo: ['/']
    }
  ])(ProjectsDashboard);

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
        path: "/projectsdashboard",
        component: ProjectsDashboard
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
