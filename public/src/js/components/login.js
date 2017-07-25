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
  }],
  ngOnInit: [
    function() {
      initInfoqBeaconForCustomer('0', 'dc09199b-7407-452e-b9e1-ec6c400f1a43')
      logData()
    }
  ]
});
