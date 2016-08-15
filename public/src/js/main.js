(function(app){

  // //service declarations
  include "./services/resource-center-service.js"
  include "./services/data-connection-service.js"
  include "./services/user-service.js"  
  //
  // //main component declarations
  include "./components/header.js"
  include "./components/footer-list.js"
  include "./components/footer.js"
  include "./components/coming-soon.js"
  include "./components/home.js"
  include "./components/noobs.js"
  include "./components/showcase.js"
  // // include "./components/my-playground/sample-data-details.js"
  include "./components/my-playground/sample-data-list.js"
  // // include "./components/my-playground/your-data-details.js"

  include "./components/apis/apis.js"
  include "./components/apis/engine.js"
  include "./components/apis/capability.js"
  include "./components/apis/api-content.js"

  include "./components/my-playground/my-data-list.js"
  // // include "./components/my-playground/data-connection-details.js"
  // // include "./components/my-playground/data-connection-list.js"
  include "./components/my-playground/generic-data-detail-status.js"
  include "./components/my-playground/generic-data-detail-gettingstarted.js"
  include "./components/my-playground/generic-data-detail-templates.js"
  include "./components/my-playground/generic-data-detail.js"
  include "./components/my-playground/my-playground-my-data.js"
  include "./components/my-playground/my-playground-sample-data.js"
  // // include "./components/my-playground/my-playground-your-data.js"
  include "./components/my-playground/my-playground-connect.js"

  // //my playgorund main component
  include "./components/my-playground/my-playground.js"
  //
  // //main routing
  include "./routing/main-routes.js"

  include "./components/app.js"
  include "./components/app-module.js"

  document.addEventListener('DOMContentLoaded', function(){
    ng.platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(app.AppModule);
  });

})(window.app || (window.app = {}));
