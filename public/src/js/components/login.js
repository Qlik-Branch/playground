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
