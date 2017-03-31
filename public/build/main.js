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
      this.showcaseItems;
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
    getShowcaseItems: function(callbackFn){
      if(!this.showcaseItems){
        this.http.get("/server/showcaseitems").subscribe(response=>{
          this.showcaseitems = JSON.parse(response._body)
          callbackFn(this.showcaseitems);
        });
      }
      else {
        callbackFn(this.showcaseItems);
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
    },
    deleteConnection: function(connectionId, callbackFn){
      this.http.get("/server/deleteconnection/"+connectionId).subscribe(response => {
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
    playgroundVisited: function(callbackFn) {
      this.http.get('/server/visited').subscribe(response => {
        if(response._body!=="") {
          response = JSON.parse(response._body)
          if(response.success === true) {
            this.user.user.playground_first_visited = new Date()
          }
          callbackFn(response.success)
        }
        else {
          callbackFn(false)
        }
      })
    },
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

  app.PubSub = ng.core.Injectable({

  })
  .Class({
    constructor: [function(){
      this.publications = {};
    }],
    subscribe(publication, subscriber, fn){
      if(!this.publications[publication]){
        this.publications[publication] = {
          subscribers: {}
        }
      }
      this.publications[publication].subscribers[subscriber] = fn;
    },
    publish(publication, params){
      if(this.publications[publication]){
        for(let s in this.publications[publication].subscribers){
          this.publications[publication].subscribers[s].call(null, params);
        }
      }
    }
  })

  app.QSocksService = ng.core.Injectable({

  })
  .Class({
      constructor: [ng.http.Http, app.PubSub, function(http, pubsub){
        this.http = http;
        this.pubsub = pubsub;
        this.currentAppId;
        this.global;
        this.app;
        this.ticket;
      }],
      connect: function(config, callbackFn){
        if(this.currentAppId!=config.appname){
          if(this.currentAppId){
            this.disconnect();
          }
          this.currentAppId = config.appname;
        }
        if(!this.global){
          this.authenticate(config, (err, ticket)=>{
            if(err){
              callbackFn(err);
            }
            else{
              config.ticket = ticket;
              qsocks.ConnectOpenApp(config).then((result)=>{
                this.global = result[0];
                this.app = result[1];
                callbackFn(null, this.global, this.app);
              });
            }
          })
        }
        else{
          config.ticket = this.ticket;
          qsocks.ConnectOpenApp(config).then((result)=>{
            this.global = result[0];
            this.app = result[1];
            callbackFn(null, this.global, this.app);
          });
        }
      },
      authenticate: function(config, callbackFn){
        this.http.get('/api/ticket?apikey='+config.apiKey).subscribe((response)=>{
          if(response._body!==""){
            response = JSON.parse(response._body);
            config.ticket = response.ticket;
            callbackFn(null, response.ticket)
          }
          else{
            console.log('error getting ticket');
            callbackFn('error getting ticket');
          }
        });
      },
      disconnect: function(){
        if(this.app && this.app.connection){
          this.app.connection.close();
        }
      },

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
      userService.getUser(false, (user) => {
        this.user = user.user;
        this.loginUrl = user.loginUrl;
        this.returnUrl = user.returnUrl;
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
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/footer.html'
  })
  .Class({
    constructor: function(){
      this.sitesone = {
        header: "QLIK SITES",
        items:[
          {
            text: "Qlik.com",
            link : "http://www.qlik.com"
          },
          {
            text: "Qlik Cloud",
            link : "http://www.qlikcloud.com"
          },
          {
            text: "Qlik Community",
            link : "http://community.qlik.com"
          },
        ]
      }
      this.sitestwo = {
        header: "",
        items:[
          {
            text: "Partner Portal",
            link : "https://login.qlik.com/login.aspx?returnURL=%2fexternal%2fportal.aspx"
          },
          {
            text: "Qlik Support",
            link : "https://qliksupport.force.com/apex/QS_Home_Page"
          }
        ]
      }
      this.sitesthree = {
        header: "",
        items:[
          {
            text: "Qlik Market",
            link : "http://market.qlik.com"
          },
          {
            text: "Demo Site",
            link : "http://sense-demo.qlik.com"
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

  app.Showcase = ng.core.Component({
    selector: 'playground-showcase',
    templateUrl: '/views/showcase.html'
  })
  .Class({
    constructor: [app.DataConnectionService, app.UserService, function(dataConnectionService, userService){
      this.dataConnectionService = dataConnectionService;
      this.userService = userService;
      this.items;
      this.itemKeys;
      this.apiKey;
      this.userService.getUser(false, user=>{
        if(user && user.user){
          this.apiKey = user.user.apiKey;  
        }
      });
      this.dataConnectionService.getShowcaseItems(items=>{
        this.items = items;
        this.itemKeys = Object.keys(items);
        this.userService.getUserConnections(connections=>{
          let connectionList = connections.connections;
          for(let i in this.items){
            if(this.items[i].ownData){
              for(let c in connectionList){
                if(this.items[i].connectionId == connectionList[c].connection){
                  if(connectionList[c].appid){
                    this.items[i].canUseOwnData = true;
                    this.items[i].appid = connectionList[c].appid;
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
  })
  .Class({
    constructor: [app.UserService, function(userService){
      this.dialog;
      this.user;
      this.loginUrl;
      this.returnUrl;
      userService.getUser(false, (user) => {
        this.user = user.user;
        this.loginUrl = user.loginUrl;
        this.returnUrl = user.returnUrl;
      });
    }]
  });

  app.Thanks = ng.core.Component({
    selector: 'playground-thanks',
    templateUrl: '/views/thanks.html'
  })
  .Class({
    constructor: [app.UserService, ng.router.ActivatedRoute, ng.router.Router, function(userService, route, router){
      this.trackingPixel
      userService.getUser(false, (user)=>{
        if(!user.user){
          router.navigate(["/login"])
        } else {
          userService.playgroundVisited(result => {
            if(result == null || result === false) {
              router.navigate(["/myplayground"])
            } else {
              var axel = Math.random()+"";
              var a = axel * 10000000000000;
              this.trackingPixel = `https://pubads.g.doubleclick.net/activity;xsp=212190;ord=${a}?`
            }
          })
        }
      })
    }]
  });

  app.Terms = ng.core.Component({
    selector: 'playground-terms',
    templateUrl: '/views/terms.html'
  })
  .Class({
    constructor: function(){
      console.log('constructor');
    }
  });


  app.Learn = ng.core.Component({
    selector: 'playground-learn',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/learn/learn.html'
  }).Class({
    constructor: [ng.router.ActivatedRoute, function(route){
      this.route = route;
    }],
    isPath: function(path){
      console.log('child url is');
      console.log(this.route.children[0].url.value[0]);
      return this.route.children[0].url.value[0].path == path;
    }
  });

  app.Noobs = ng.core.Component({
    selector: 'playground-noobs',
    templateUrl: '/views/learn/noobs.html'
  })
  .Class({
    constructor: [ng.core.ChangeDetectorRef, app.DataConnectionService, app.QSocksService, function(cdr, dataConnectionService, qsocksService){
      this.cdr = cdr;
      this.dataConnectionService = dataConnectionService;
      this.qsocksService = qsocksService;
      this.fields = [];
      this.loading = true;
      this.connectionStatus = "Please wait...";
      this.connectionDetail = "Connecting";
      this.dataConnectionService.getConnectionInfo("noobs", (connInfo)=>{
          this.qsocksService.connect(connInfo, (err, global, app)=>{
            if(err){
              this.connectionStatus = "Error!";
              this.connectionDetail = err;
            }
            if(app){
              this.loading = false;
              this.fields = [
                "Doctor",
                "Patient",
                "Drug",
                "Cost"
              ]
              this.cdr.detectChanges();
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
    constructor: [ng.router.ActivatedRoute, app.ResourceCenterService, function(route, resourceCenterService){
      this.route = route;
      this.resourceCenterService = resourceCenterService;
      this.api = this.route.parent.url.value[0].path;
      route.params.subscribe((route)=>{
        this.getResourceContent(route);
      });
    }],
    getResourceContent: function(route){
      let resourceId = null;
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
      if(resourceId){
        this.resourceCenterService.getResource(resourceId, (resource)=>{
          resource = JSON.parse(resource);
          if(resource && resource.data && resource.data.length > 0){
            resource = resource.data[0];
            this.resourceTitle = resource.title;
            console.log(resource);
            this.content = marked(this.arrayBufferToBase64(resource.content.data));
            setTimeout(function(){
              $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
              });
            }, 100);
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
    constructor: [ng.router.ActivatedRoute, app.UserService, function(route, userService){
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
      route.params.subscribe((route)=>{
        this.tab = route.tab;
      });
      userService.getUser(false, (user)=>{
        if(user){
          //my data
          if(user.myParsedConnections){
            this.myConns = user.myParsedConnections;
            this.myConnKeys = Object.keys(this.myConns);
          }
          if(user.runningAppCount){
            this.myRunningAppCount = user.runningAppCount;
          }
          //sample data
          this.apps = user.sampleData;
          this.appKeys = Object.keys(this.apps);
          //connect
          this.conns = user.dataConnections;
          this.connKeys = Object.keys(this.conns);
        }
      })
    }
    ]
  })

  app.GenericDataDetailDelete = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail-delete',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/generic-data-detail-delete.html'
  })
  .Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, app.DataConnectionService, function(route, userService, dataConnectionService){
      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      this.dataConnectionService = dataConnectionService;
      this.connectionId = route.parent.url.value[0].path;
      this.connectionStatus = '';
      this.connectionStatusDetail = "";
      this.connection;
      this.isMyData = false;
      userService.getUser(false, (user)=>{
        if(user.myParsedConnections[this.connectionId]){
          this.isMyData = true;
          this.connection = user.myParsedConnections[this.connectionId];
        }
        else{
          this.connection = user.sampleData[this.connectionId];
        }
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
        this.connectionStatus = "Running";
      }
      else {
        this.connectionStatus = "Stopped";
        this.connectionStatusDetail = "";
      }
    },
    deleteAppAndConnection: function(connectionId){
      this.connectionStatus = "Deleting";
      this.connectionStatusDetail = "Stopping application.";
      this.dataConnectionService.stopApp(connectionId, (connInfo)=>{
        this.connectionStatusDetail = "Deleting application.";
        this.dataConnectionService.deleteConnection(connectionId, (result)=>{
          if(result.err){
            this.connectionStatus = "Error";
            this.connectionStatusDetail = err;
          }
          else{
            window.location.pathname = "myplayground/mydata";
          }
        });
      })
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
        this.connectionStatus = "Running";
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

  app.GenericDataDetailFieldExplorer = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail-field-explorer',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/generic-data-detail-field-explorer.html'
  })
  .Class({
    constructor: [ng.router.ActivatedRoute, ng.core.ChangeDetectorRef, app.UserService, app.DataConnectionService, app.QSocksService, function(route, cdr, userService, dataConnectionService, qsocksService){
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
      this.userService.getUser(false, (user)=>{
        this.dataConnectionService.getConnectionInfo(this.connectionId, (connInfo)=>{
            this.qsocksService.connect(connInfo, (err, global, app)=>{
              if(err){
                this.connectionStatus = "Error!";
                this.connectionDetail = err;
              }
              if(app){
                let fieldListDef = {
                  qInfo:{
                    qType: "FieldList"
                  },
                  qFieldListDef: {}
                }
                app.createSessionObject(fieldListDef).then((fieldsObject)=>{
                  fieldsObject.getLayout().then((layout)=>{
                    this.loading = false;
                    layout.qFieldList.qItems.forEach((item, index)=>{
                      this.fields[item.qName]={ selected: false};
                    });
                    console.log(this.fields);
                    this.fieldKeys = Object.keys(this.fields).sort();
                    this.cdr.detectChanges();
                  });
                });
              }
            })
        });

      });
    }],
    toggleField: function(field){
      let fieldIndex = this.selectedFields.indexOf(field);
      if(fieldIndex==-1){
        this.selectedFields.push(field);
      }
      else{
        this.selectedFields.splice(fieldIndex, 1);
      }
    }
  })

  app.GenericDataDetailTemplates = ng.core.Component({
    selector: 'playground-my-playground-generic-data-detail-templates',
    directives: [ng.router.ROUTER_DIRECTIVES],
    templateUrl: '/views/my-playground/generic-data-detail-templates.html'
  })
  .Class({
    constructor: [ng.router.ActivatedRoute, app.UserService, ng.platformBrowser.DomSanitizationService, function(route, userService, domsanService){
      this.domsanService = domsanService;
      let connectionId = route.parent.url.value[0].path;
      this.connection = {};
      this.sampleProjects = {};
      this.isMyData = false;
      var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
      this.ghdlPrefix = "github-windows";
      if(isMac){
        this.ghdlPrefix = "github-mac";
      }
      userService.getUser(false, (user)=>{
        if(user.myParsedConnections[connectionId]){
          this.isMyData = true;
          this.connection = user.myParsedConnections[connectionId];
        }
        else{
          this.connection = user.sampleData[connectionId];
        }
        this.sampleProjects = user.sampleProjects;
        this.sampleProjectKeys = Object.keys(this.sampleProjects);
        for(let p of this.sampleProjectKeys){
          this.sampleProjects[p].ghdlUrl = this.domsanService.bypassSecurityTrustUrl(`${this.ghdlPrefix}://openRepo/${this.sampleProjects[p]['github-repo']}`);
        }
      });
    }],
    copyToClipboard: function(index){
      var itemInput = document.getElementById(index+"_clone_url");
      itemInput.select();
      document.execCommand('copy');
    },
    sanitizeUrl: function(url){
      return this.domsanService.bypassSecurityTrustUrl(url);
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
          this.connectionStatus = "Running";
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
        this.connectionStatus = "Running";
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


  app.ListObject = ng.core.Component({
    selector: 'playground-vis-listobject',
    directives: [ng.router.ROUTER_DIRECTIVES],
    inputs: ['field:field'],
    templateUrl: '/views/vis/list-object.html'
  }).Class({
    constructor: [ng.core.ChangeDetectorRef, app.QSocksService, app.PubSub, function(cdr, qsocksService, pubsub){
      this.cdr = cdr;
      this.qsocksService = qsocksService;
      this.pubsub = pubsub;
      this.field = "";
      this.listValues = [];
      this.genericObject;
    }],
    ngOnInit(){
      let def = {
        qInfo:{
          qType: "ListObject"
        },
        qListObjectDef:{
          qDef: {
            qFieldDefs:[  //the name of the field to load
              this.field
            ],
            qFieldLabels:[  //the label we want to give the field
              this.field
            ],
            qSortCriterias: [
              {
                qSortByState: 1 //we sort by state first asc
              },
              {
                qSortByAscii: 1 //and then text value asc
              }
            ]
          },
          qInitialDataFetch:[ //an array of data pages we want to fetch when we first call 'getLayout()' on the list object
            {
                qTop: 0,
                qLeft: 0,
                qWidth: 1,
                qHeight: 100
            }
          ]
        }
      }
      this.qsocksService.app.createSessionObject(def).then((genericObject)=>{
        this.pubsub.subscribe('update', genericObject.handle, this.getLayout.bind(this));
        this.pubsub.subscribe('loading', genericObject.handle, this.setLoading.bind(this));
        this.genericObject = genericObject;
        this.getLayout();
      });
    },
    clearAll(){

    },
    search(field, event){
      this.pubsub.publish('loading');
      if(event.keyCode === 13){
        //confirm the search
        event.target.value = "";
        this.genericObject.acceptListObjectSearch("/qListObjectDef", true).then((response)=>{
          this.pubsub.publish('update');
        });
      }
      else if (event.keyCode === 27 || event.target.value.length == 0) {
        //cancel the search
        event.target.value = "";
        this.genericObject.abortListObjectSearch("/qListObjectDef").then((response)=>{
          this.pubsub.publish('update');
        });
      }
      else{
        if(event.target.value.length > 0){
          this.genericObject.searchListObjectFor("/qListObjectDef", event.target.value).then((response)=>{
            this.pubsub.publish('update');
          });
        }
        else{
          this.genericObject.abortListObjectSearch("/qListObjectDef").then((response)=>{
            this.pubsub.publish('update');
          });
        }
      }
      console.log('searching');
    },
    clearSearch(field, event){
      this.pubsub.publish('loading');
      var inputEl = document.getElementById(field+"_search_input");
      if(inputEl){
        inputEl.value = "";
        this.genericObject.abortListObjectSearch("/qListObjectDef").then((response)=>{
          this.pubsub.publish('update');
        });
      }
    },
    clearFieldSelections(){
      this.pubsub.publish('loading');
      this.genericObject.clearSelections("/qListObjectDef").then((response)=>{
        this.pubsub.publish('update');
      });
    },
    setLoading(){
      var loadingEl = document.getElementById(this.field+"_listbox_loading");
      if(loadingEl){
        loadingEl.classList.add('loading');
      }
    },
    getLayout(){
      this.genericObject.getLayout().then((layout)=>{
        this.listValues = [];
        let matrix = layout.qListObject.qDataPages[0].qMatrix;
        matrix.forEach((row, index)=>{
          this.listValues.push(row[0]);
        });
        this.cdr.detectChanges();
        var loadingEl = document.getElementById(this.field+"_listbox_loading");
        if(loadingEl){
          loadingEl.classList.remove('loading');
        }
      });

    },
    toggleValue(elemNum, event){
      this.pubsub.publish('loading');
      this.genericObject.selectListObjectValues("/qListObjectDef", [parseInt(elemNum)], true).then((response)=>{
        event.target.parentElement.scrollTop = 0;
        this.pubsub.publish('update');
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
      this.MAX_RUNNING_APPS = 3;
      this.myRunningAppCount = 0;
      this.myConns;
      this.myConnKeys;
      this.route = route;
      //title block variables
      this.title = "";
      this.description = "";
      this.tab = "";
      userService.getUser(false, (user)=>{
        if(!user.user){
          router.navigate(["/login"]);
          // window.location.pathname = "login";
        }
        if(user){
          if(user.user && user.user.playground_first_visited == null) {
            router.navigate(["/thanks"]);
          }
          if(user.myParsedConnections){
            this.myConns = user.myParsedConnections;
            this.myConnKeys = Object.keys(this.myConns);
          }
          if(user.runningAppCount){
            this.myRunningAppCount = user.runningAppCount;
          }
        }
        route.children[0].params.subscribe((route)=>{
          this.tab = route.tab;
          switch (route.tab) {
            case "mydata":
              this.title = "My Data";
              this.description = `
              Here is a list of your authorized connections. You can authorize as many connections as you would like but you can only have ${this.MAX_RUNNING_APPS} active at the same time.
              <br>
              <strong class="orange">Connections active (${this.myRunningAppCount} of ${this.MAX_RUNNING_APPS})</strong>
              `;
              break;
            case "sampledata":
              this.title = "Sample Data";
              this.description = "Use our sample data sets below to create your own projects or use one of our templates.";
              break;
            case "connect":
              this.title = "Connect";
              this.description = "Want to create projects using your own data? Below are some connections which you can use.";
              break;
            default:

          }
        });
      })
    }]
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
    },
    {
      path: 'explorer',
      component: app.GenericDataDetailFieldExplorer
    },
    {
      path: 'delete',
      component: app.GenericDataDetailDelete
    }
  ];

  let mainRoutes = [
    {
      path: '',
      component: app.Home
    },
    {
      path: 'learn',
      component: app.Learn,
      children: [
        {
          path: '',
          pathMatch: 'full',
          redirectTo: 'noobs'
        },
        {
          path: 'noobs',
          children: [
            {
              path: '',
              pathMatch: 'full',
              redirectTo: 'intro'
            },
            {
              path: 'intro',
              component: app.Noobs
            },
            {
              path: ':subject',
              component: app.APIContent
            }
          ]
        },
        {
          path: 'engine',
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
          path: ':tab',
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
    },
    {
      path: "login",
      component: app.Login
    },
    {
      path: "thanks",
      component: app.Thanks
    },
    {
      path: "terms",
      component: app.Terms
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
      app.Learn,
      app.Terms,
      app.APIContent,
      app.MyPlayground,
      app.MyPlaygroundMyData,
      app.MyDataList,
      app.GenericDataDetail,
      app.GenericDataDetailDelete,
      app.GenericDataDetailGettingStarted,
      app.GenericDataDetailTemplates,
      app.GenericDataDetailFieldExplorer,
      app.GenericDataDetail,
      app.Showcase,
      app.ListObject,
      app.Login
    ],
    providers: [
      ng.http.HTTP_PROVIDERS,
      app.ResourceCenterService,
      app.UserService,
      app.DataConnectionService,
      app.QSocksService,
      app.PubSub
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
