let Header = ng.core.Component({
  selector: 'playground-header',
  directives: [ng.router.ROUTER_DIRECTIVES],
  providers: [UserService],
  templateUrl: '/views/header.html'
})
.Class({
  constructor: [UserService, function(userService){
    userService.getUser((user) => {
      this.user = user;
    });
  }]
});
