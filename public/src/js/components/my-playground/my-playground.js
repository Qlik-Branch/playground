app.MyPlayground = ng.core.Component({
  selector: 'playground-my-playground',
  directives: [ng.router.ROUTER_DIRECTIVES],
  templateUrl: '/views/my-playground/my-playground.html'
}).Class({
  constructor: [app.UserService, ng.router.Router, function (userService, route) {
    userService.getUser(false, function (user) {
      if(!user.user){
        route.navigate(["/login"]);
        // window.location.pathname = "login";
      }
    });
  }]
});
