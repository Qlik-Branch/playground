(function(playground){

  //service declarations
  include "./services/config-service.js"
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
  include "./components/projects-dashboard/sample-data-details.js"
  include "./components/projects-dashboard/sample-data-list.js"
  include "./components/projects-dashboard/your-data-details.js"
  include "./components/projects-dashboard/your-data-list.js"
  include "./components/projects-dashboard/data-connection-details.js"
  include "./components/projects-dashboard/data-connection-list.js"
  include "./components/projects-dashboard/projects-dashboard-main.js"
  include "./components/projects-dashboard/projects-dashboard-sample-data.js"
  include "./components/projects-dashboard/projects-dashboard-your-data.js"
  include "./components/projects-dashboard/projects-dashboard-connect.js"
  include "./components/projects-dashboard/projects-dashboard.js"
  include "./components/showcase.js"

  include "./components/app.js"

  document.addEventListener('DOMContentLoaded', function(){
    ng.platformBrowserDynamic.bootstrap(AppComponent, [ng.http.HTTP_PROVIDERS, ng.router.ROUTER_PROVIDERS, ng.core.provide(ng.common.LocationStrategy, { useClass: ng.common.PathLocationStrategy })]);
  });

})(window.playground || (window.playground = {}));
