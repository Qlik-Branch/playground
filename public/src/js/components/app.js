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
