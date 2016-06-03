(function(playground){

  //service declarations
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

  let ExampleAppService =
  ng.core.Injectable({

  })
  .Class({
    constructor: [ng.http.Http, function(http){
      this.http = http;
      this.exampleApps;
    }],
    getExampleApps: function(callbackFn){
      if(this.exampleApps){
        callbackFn(this.exampleApps);
      }
      else{
        this.http.get('/configs/example-apps.json').subscribe(response => {
          if(response._body!==""){
            callbackFn(JSON.parse(response._body));
          }
          else{
            callbackFn();
          }
        });
      }
    }
  });


  //component declarations
  let Header = ng.core.Component({
    selector: 'playground-header',
    directives: [ng.router.ROUTER_DIRECTIVES],
    providers: [UserService],
    templateUrl: '/views/header.html'
  })
  .Class({
    constructor: [UserService, function(userService){
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

  let CloneInfo = ng.core.Component({
    selector: 'clone-info',
    templateUrl: '/views/clone-info.html',
    inputs:[
      'info'
    ]
  })
  .Class({
    constructor: [function(){
      this.info = null;
      this.dialog;
    }],
    show: function(triggerElementId, popupElementId){
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
    close: function(){
      this.dialog.close();
      this.dialog = null;
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

  let ExampleAppDetails = ng.core.Component({
    selector: 'example-app-details',
    directives: [CloneInfo],
    viewProviders: [ng.router.ROUTER_PROVIDERS, ExampleAppService],
    templateUrl: '/views/getting-started/example-app-details.html'
  })
  .Class({
    constructor: [ng.router.RouteSegment, ExampleAppService, function(routeSegment, exampleAppService){
      this.routeSegment = routeSegment;
      this.appId = routeSegment.parameters.id;
      this.selectedApp = {};
      this.sampleProjects = [];
      this.selectedProject = {};
      exampleAppService.getExampleApps((apps)=>{
        this.selectedApp = apps[this.appId];
        this.config = JSON.stringify(this.selectedApp.config, null, ' ');
        this.sampleProjects = this.selectedApp['sample-projects'];
        if(this.sampleProjects.length > 0){
          this.selectedProject = this.sampleProjects[0];
        }
      })
    }],
    openCloneInfo: function(projectIndex){
      this.selectedProject = this.sampleProjects[projectIndex];
      var popupElement = document.getElementById("sample_project_clone_info");
      var dialog = leonardoui.dialog({
        content: popupElement,
        shadow: true,
        closeOnEscape: false      
      });
    }
  })

  let ExampleAppList = ng.core.Component({
    selector: 'example-app-list',
    directives: [ng.router.ROUTER_DIRECTIVES],
    viewProviders: [ExampleAppService],
    templateUrl: '/views/getting-started/example-app-list.html'
  })
  .Class({
    constructor: [ExampleAppService, function(exampleAppService){
      exampleAppService.getExampleApps((apps)=>{
        this.apps = apps;
        this.appKeys = Object.keys(apps);
      });
    }]
  })

  let GettingStartedMain = ng.core.Component({
    selector: 'playground-getting-started-main',
    directives: [ng.router.ROUTER_DIRECTIVES, ComingSoon],
    templateUrl: '/views/getting-started/getting-started-main.html'
  })
  .Class({
    constructor: function(){

    }
  })

  let GettingStartedExamples = ng.core.Component({
    selector: 'playground-getting-started-examples',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/getting-started/getting-started-examples.html'
  })
  .Class({
    constructor: function(){

    }
  })

  GettingStartedExamples = ng.router.Routes([
    {
      path: "/",
      component: ExampleAppList
    },
    {
      path: "/:id",
      component: ExampleAppDetails
    },
    {
      path: '/**',
      redirectTo: ['/']
    }
  ])(GettingStartedExamples);

  var GettingStarted = ng.core.Class({
    constructor: function(){

    }
  })

  GettingStarted = ng.core.Component({
    selector: 'playground-getting-started',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/getting-started/getting-started.html'
  })(GettingStarted);

  GettingStarted = ng.router.Routes([
    {
      path: "/",
      component: GettingStartedMain
    },  
    {
      path: "/exampleapps",
      component: GettingStartedExamples
    },
    {
      path: '/**',
      redirectTo: ['/']
    }
  ])(GettingStarted);

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
        path: "/gettingstarted",
        component: GettingStarted
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
