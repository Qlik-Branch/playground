(function(playground){

  //service declarations
  include "./services/user-service.js"
  
  //component declarations
  include "./components/header.js"
  include "./components/footer-list.js"
  include "./components/footer.js"
  include "./components/home.js"
  include "./components/noobs.js"
  include "./components/getting-started.js"
  include "./components/showcase.js"

  include "./components/app.js"

  document.addEventListener('DOMContentLoaded', function(){
    ng.platformBrowserDynamic.bootstrap(AppComponent, [ng.http.HTTP_PROVIDERS, ng.router.ROUTER_PROVIDERS, ng.core.provide(ng.common.LocationStrategy, { useClass: ng.common.PathLocationStrategy })]);
  });

})(window.playground || (window.playground = {}));
