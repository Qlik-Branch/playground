(function(playground){

  //service declarations
  include "./services/user-service.js"
  include "./services/sample-data-service.js"
  include "./services/data-connection-service.js"

  //component declarations
  include "./components/header.js"
  include "./components/footer-list.js"
  include "./components/footer.js"
  include "./components/coming-soon.js"
  include "./components/home.js"
  include "./components/noobs.js"  
  include "./components/my-playground/sample-data-details.js"
  include "./components/my-playground/sample-data-list.js"
  include "./components/my-playground/your-data-details.js"
  include "./components/my-playground/your-data-list.js"
  include "./components/my-playground/data-connection-details.js"
  include "./components/my-playground/data-connection-list.js"
  include "./components/my-playground/my-playground-main.js"
  include "./components/my-playground/my-playground-sample-data.js"
  include "./components/my-playground/my-playground-your-data.js"
  include "./components/my-playground/my-playground-connect.js"
  include "./components/my-playground/my-playground.js"
  include "./components/showcase.js"

  include "./components/app.js"

  document.addEventListener('DOMContentLoaded', function(){
    ng.platformBrowserDynamic.bootstrap(AppComponent, [ng.http.HTTP_PROVIDERS, ng.router.ROUTER_PROVIDERS, ng.core.provide(ng.common.LocationStrategy, { useClass: ng.common.PathLocationStrategy })]);
  });

})(window.playground || (window.playground = {}));
