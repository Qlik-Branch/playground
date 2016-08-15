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
    if(!userService.user){
      userService.getUser(false, (user) => {
        this.user = user.user;
        this.loginUrl = user.loginUrl;
        this.returnUrl = user.returnUrl;
      });
    }
  }]
});
