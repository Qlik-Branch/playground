let Header = ng.core.Component({
  selector: 'playground-header',
  directives: [ng.router.ROUTER_DIRECTIVES],
  providers: [ConfigService,UserService],
  templateUrl: '/views/header.html'
})
.Class({
  constructor: [ConfigService,UserService, function(configService,userService){
    this.dialog;
    this.user;
    this.apiKey;
    configService.getConfigs((configs) => {
      this.loginUrl = configs.loginUrl;
      this.returnUrl = configs.returnUrl;
    });
    userService.getUser((user) => {
      this.user = user.user;
      this.apiKey = user.apiKey;
    });
  }]
});
