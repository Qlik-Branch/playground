(function(app){

  // //service declarations
  include "./services/resource-center-service.js"
  include "./services/data-connection-service.js"
  include "./services/user-service.js"
  include "./services/pubsub.js"
  include "./services/qsocks-service.js"
  //
  // //main component declarations
  include "./components/header.js"
  include "./components/footer-list.js"
  include "./components/footer.js"
  include "./components/coming-soon.js"
  include "./components/home.js"
  include "./components/showcase.js"
  include "./components/login.js"
  include "./components/thanks.js"
  include "./components/terms.js"

  include "./components/learn/learn.js"
  include "./components/learn/noobs.js"
  include "./components/learn/api-content.js"

  include "./components/my-playground/my-data-list.js"
  include "./components/my-playground/generic-data-detail-delete.js"
  include "./components/my-playground/generic-data-detail-gettingstarted.js"
  include "./components/my-playground/generic-data-detail-field-explorer.js"
  include "./components/my-playground/generic-data-detail-templates.js"
  include "./components/my-playground/generic-data-detail.js"
  include "./components/my-playground/my-playground-my-data.js"

  include "./components/vis/list-object.js"

  // //my playground main component
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


window.ga('create', 'UA-87754759-2', 'auto');
var currentPage = "fakeStartingPage";
setInterval(function()
{
    if (currentPage !== window.location.href)
    {
        currentPage = window.location.href;
        window.ga('send', 'pageview', window.location.href);
    }
}, 1000);