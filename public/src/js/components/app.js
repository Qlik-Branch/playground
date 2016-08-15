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
